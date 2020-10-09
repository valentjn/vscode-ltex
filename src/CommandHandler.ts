/* Copyright (C) 2020 Julian Valentin, LTeX Development Community
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import * as Code from 'vscode';
import * as CodeLanguageClient from 'vscode-languageclient';
import * as Path from 'path';

import BugReporter from './BugReporter';
import {i18n} from './I18n';
import Logger from './Logger';
import ProgressStack from './ProgressStack';

export default class CommandHandler {
  private _bugReporter: BugReporter;
  private _languageClient: CodeLanguageClient.LanguageClient | null;

  private static readonly _featureRequestUrl: string = 'https://github.com/valentjn/vscode-ltex/' +
      'issues/new?assignees=&labels=1-feature-request&template=feature-request.md&title=';

  public constructor(bugReporter: BugReporter) {
    this._bugReporter = bugReporter;
    this._languageClient = null;
  }

  public set languageClient(languageClient: CodeLanguageClient.LanguageClient | null) {
    this._languageClient = languageClient;
  }

  public register(context: Code.ExtensionContext): void {
    context.subscriptions.push(Code.commands.registerCommand('ltex.checkCurrentDocument',
        this.checkCurrentDocument.bind(this)));
    context.subscriptions.push(Code.commands.registerCommand('ltex.checkAllDocumentsInWorkspace',
        this.checkAllDocumentsInWorkspace.bind(this)));
    context.subscriptions.push(Code.commands.registerCommand(
        'ltex.clearDiagnosticsInCurrentDocument',
        this.clearDiagnosticsInCurrentDocument.bind(this)));
    context.subscriptions.push(Code.commands.registerCommand('ltex.clearAllDiagnostics',
        this.clearAllDiagnostics.bind(this)));
    context.subscriptions.push(Code.commands.registerCommand('ltex.reportBug',
        this._bugReporter.report.bind(this._bugReporter)));
    context.subscriptions.push(Code.commands.registerCommand('ltex.requestFeature',
        CommandHandler.requestFeature));

    context.subscriptions.push(Code.commands.registerCommand('ltex.addToDictionary',
        CommandHandler.addToDictionary));
    context.subscriptions.push(Code.commands.registerCommand('ltex.disableRules',
        CommandHandler.disableRules));
    context.subscriptions.push(Code.commands.registerCommand('ltex.ignoreRulesInSentence',
        CommandHandler.ignoreRulesInSentence));
  }

  private async checkDocument(uri: Code.Uri, codeLanguageId?: string,
        text?: string): Promise<boolean> {
    if (this._languageClient == null) {
      Code.window.showErrorMessage(i18n('ltexNotInitialized'));
      return Promise.resolve(false);
    }

    const args: any = {uri: uri.toString()};
    if (codeLanguageId != null) args.codeLanguageId = codeLanguageId;
    if (text != null) args.text = text;

    const result: any = await this._languageClient.sendRequest('workspace/executeCommand',
        {command: 'ltex.checkDocument', arguments: [args]});

    if (result.success) {
      return Promise.resolve(true);
    } else {
      Code.window.showErrorMessage(i18n('couldNotCheckDocument', uri.fsPath, result.errorMessage));
      return Promise.resolve(false);
    }
  }

  private async checkCurrentDocument(): Promise<boolean> {
    if (this._languageClient == null) {
      Code.window.showErrorMessage(i18n('ltexNotInitialized'));
      return Promise.resolve(false);
    }

    const textEditor: Code.TextEditor | undefined = Code.window.activeTextEditor;

    if (textEditor == null) {
      Code.window.showErrorMessage(i18n('noEditorOpenToCheckDocument'));
      return Promise.resolve(false);
    }

    return this.checkDocument(textEditor.document.uri, textEditor.document.languageId,
        textEditor.document.getText());
  }

  private async checkAllDocumentsInWorkspace(): Promise<boolean> {
    if (this._languageClient == null) {
      Code.window.showErrorMessage(i18n('ltexNotInitialized'));
      return Promise.resolve(false);
    }

    const progressOptions: Code.ProgressOptions = {
          title: 'LTeX',
          location: Code.ProgressLocation.Notification,
          cancellable: true,
        };

    return Code.window.withProgress(progressOptions,
          async (progress: Code.Progress<{increment?: number; message?: string}>,
            token: Code.CancellationToken): Promise<boolean> => {
      const codeProgress: ProgressStack = new ProgressStack(
          i18n('checkingAllDocumentsInWorkspace'), progress);

      codeProgress.startTask(0.1, i18n('findingAllDocumentsInWorkspace'));
      if (token.isCancellationRequested) return Promise.resolve(true);
      const uris: Code.Uri[] = await Code.workspace.findFiles(
          '**/*.{md,tex}', undefined, undefined, token);
      uris.sort((lhs: Code.Uri, rhs: Code.Uri) => lhs.fsPath.localeCompare(rhs.fsPath));
      codeProgress.finishTask();

      codeProgress.startTask(0.9, i18n('checkingAllDocumentsInWorkspace'));
      const n: number = uris.length;

      for (let i: number = 0; i < n; i++) {
        codeProgress.updateTask(i / n,
            i18n('checkingDocumentN', i + 1, n, Path.basename(uris[i].fsPath)));
        if (token.isCancellationRequested) return Promise.resolve(true);
        const success: boolean = await this.checkDocument(uris[i]);
        if (!success) return Promise.resolve(false);
      }

      codeProgress.finishTask();

      if (n > 0) {
        return Promise.resolve(true);
      } else {
        Code.window.showErrorMessage((Code.workspace.workspaceFolders == null) ?
            i18n('couldNotCheckDocumentsAsNoFoldersWereOpened') :
            i18n('couldNotCheckDocumentsAsNoDocumentsWereFound'));
        return Promise.resolve(false);
      }
    });
  }

  private clearDiagnosticsInCurrentDocument(): Promise<boolean> {
    if (this._languageClient == null) {
      Code.window.showErrorMessage(i18n('ltexNotInitialized'));
      return Promise.resolve(false);
    }

    const diagnostics: Code.DiagnosticCollection | undefined = this._languageClient.diagnostics;
    if (diagnostics == null) return Promise.resolve(true);
    const textEditor: Code.TextEditor | undefined = Code.window.activeTextEditor;
    if (textEditor != null) diagnostics.set(textEditor.document.uri, undefined);
    return Promise.resolve(true);
  }

  private clearAllDiagnostics(): Promise<boolean> {
    if (this._languageClient == null) {
      Code.window.showErrorMessage(i18n('ltexNotInitialized'));
      return Promise.resolve(false);
    }

    const diagnostics: Code.DiagnosticCollection | undefined = this._languageClient.diagnostics;
    if (diagnostics != null) diagnostics.clear();
    return Promise.resolve(true);
  }

  private static getSettingName(settingName: string,
        resourceConfig: Code.WorkspaceConfiguration, commandName: string): string | null {
    const configurationTargetString: string | undefined =
        resourceConfig.get(`configurationTarget.${commandName}`);

    // 'global' is deprecated since 7.0.0
    if ((configurationTargetString === 'user') || (configurationTargetString === 'global')) {
      return settingName;
    } else if ((configurationTargetString === 'workspace') ||
          (configurationTargetString === 'workspaceFolder')) {
      return configurationTargetString + settingName.charAt(0).toUpperCase() +
          settingName.substr(1);
    } else {
      Logger.error(i18n('invalidValueForConfigurationTarget', configurationTargetString));
      return null;
    }
  }

  private static requestFeature(): Promise<boolean> {
    Code.env.openExternal(Code.Uri.parse(CommandHandler._featureRequestUrl));
    return Promise.resolve(true);
  }

  private static cleanUpStringArray(array: string[]): string[] {
    const negativeSet: Set<string> = new Set();
    const positiveSet: Set<string> = new Set();

    for (const entry of array) {
      if (entry.startsWith('-')) {
        negativeSet.add(entry.substr(1));
      } else {
        positiveSet.add(entry);
      }
    }

    for (const entry of negativeSet) {
      if (positiveSet.has(entry)) {
        negativeSet.delete(entry);
        positiveSet.delete(entry);
      }
    }

    const result: string[] = [];
    for (const entry of negativeSet) result.push(`-${entry}`);
    for (const entry of positiveSet) result.push(entry);
    result.sort((a: string, b: string) => a.localeCompare(b, undefined, {sensitivity: 'base'}));

    return result;
  }

  private static async setSetting(settingName: string, settingValue: any,
        resourceConfig: Code.WorkspaceConfiguration, commandName: string): Promise<void> {
    const configurationTargetString: string | undefined =
        resourceConfig.get(`configurationTarget.${commandName}`);
    let configurationTargets: Code.ConfigurationTarget[];

    // 'global' is deprecated since 7.0.0
    if ((configurationTargetString === 'user') || (configurationTargetString === 'global')) {
      configurationTargets = [Code.ConfigurationTarget.Global];
    } else if (configurationTargetString === 'workspace') {
      configurationTargets = [Code.ConfigurationTarget.Workspace,
          Code.ConfigurationTarget.Global];
    } else if (configurationTargetString === 'workspaceFolder') {
      configurationTargets = [Code.ConfigurationTarget.WorkspaceFolder,
          Code.ConfigurationTarget.Workspace, Code.ConfigurationTarget.Global];
    } else {
      Logger.error(i18n('invalidValueForConfigurationTarget', configurationTargetString));
      return;
    }

    for (const configurationTarget of configurationTargets) {
      try {
        await resourceConfig.update(settingName, settingValue, configurationTarget);
        return;
      } catch (e) {
        if (configurationTarget == configurationTargets[configurationTargets.length - 1]) {
          Logger.error(i18n('couldNotSetConfiguration', settingName), e);
        }
      }
    }
  }

  private static addToDictionary(params: any): void {
    const resourceConfig: Code.WorkspaceConfiguration =
        Code.workspace.getConfiguration('ltex', Code.Uri.parse(params.uri));
    const settingName: string | null = CommandHandler.getSettingName(
        'dictionary', resourceConfig, 'addToDictionary');
    if (settingName == null) return;

    const dictionarySetting: {[language: string]: string[]} =
        resourceConfig.get(settingName, {});

    for (const language in params.words) {
      if (!Object.prototype.hasOwnProperty.call(params.words, language)) continue;
      let dictionary: string[] = ((dictionarySetting[language] != null) ?
          dictionarySetting[language] : []);
      dictionary = dictionary.concat(params.words[language]);
      dictionarySetting[language] = CommandHandler.cleanUpStringArray(dictionary);
    }

    CommandHandler.setSetting(
        settingName, dictionarySetting, resourceConfig, 'addToDictionary');
  }

  private static disableRules(params: any): void {
    const resourceConfig: Code.WorkspaceConfiguration =
        Code.workspace.getConfiguration('ltex', Code.Uri.parse(params.uri));
    const settingName: string | null = CommandHandler.getSettingName(
        'disabledRules', resourceConfig, 'disableRules');
    if (settingName == null) return;

    const disabledRulesSetting: {[language: string]: string[]} =
        resourceConfig.get(settingName, {});

    for (const language in params.ruleIds) {
      if (!Object.prototype.hasOwnProperty.call(params.ruleIds, language)) continue;
      let disabledRules: string[] = ((disabledRulesSetting[language] != null) ?
          disabledRulesSetting[language] : []);
      disabledRules = disabledRules.concat(params.ruleIds[language]);
      disabledRulesSetting[language] = CommandHandler.cleanUpStringArray(disabledRules);
    }

    CommandHandler.setSetting(
        settingName, disabledRulesSetting, resourceConfig, 'disableRule');
  }

  private static ignoreRulesInSentence(params: any): void {
    const resourceConfig: Code.WorkspaceConfiguration =
        Code.workspace.getConfiguration('ltex', Code.Uri.parse(params.uri));
    const ruleIds: string[] = params.ruleIds;
    const sentencePatterns: string[] = params.sentencePatterns;
    const ignoredRules: any[] = resourceConfig.get('ignoreRuleInSentence', []);

    for (let i: number = 0; i < ruleIds.length; i++) {
      ignoredRules.push({'rule': ruleIds[i], 'sentence': sentencePatterns[i]});
    }

    CommandHandler.setSetting(
        'ignoreRuleInSentence', ignoredRules, resourceConfig, 'ignoreRuleInSentence');
  }
}
