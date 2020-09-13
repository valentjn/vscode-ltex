/* Copyright (C) 2020 Julian Valentin, LTeX Development Community
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import * as Code from 'vscode';

import {i18n} from './I18n';
import Logger from './Logger';

export default class TelemetryProcessor {
  private _context: Code.ExtensionContext;
  private _progressMap: {
        [name: string]: {
          progress: number;
          startTime: number;
        };
      };
  private _statusBarMessageDisposable: Code.Disposable | null;

  public constructor(context: Code.ExtensionContext) {
    this._context = context;
    this._progressMap = {};
    this._statusBarMessageDisposable = null;
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

  private processCommand(params: any): void {
    const resourceConfig: Code.WorkspaceConfiguration =
        Code.workspace.getConfiguration('ltex', Code.Uri.parse(params.uri));

    if (params.command === 'ltex.addToDictionary') {
      const settingName: string | null = TelemetryProcessor.getSettingName(
          'dictionary', resourceConfig, 'addToDictionary');
      if (settingName == null) return;

      const dictionarySetting: {[language: string]: string[]} =
          resourceConfig.get(settingName, {});

      for (const language in params.words) {
        if (!Object.prototype.hasOwnProperty.call(params.words, language)) continue;
        let dictionary: string[] = ((dictionarySetting[language] != null) ?
            dictionarySetting[language] : []);
        dictionary = dictionary.concat(params.words[language]);
        dictionarySetting[language] = TelemetryProcessor.cleanUpStringArray(dictionary);
      }

      TelemetryProcessor.setSetting(
          settingName, dictionarySetting, resourceConfig, 'addToDictionary');

    } else if (params.command === 'ltex.disableRules') {
      const settingName: string | null = TelemetryProcessor.getSettingName(
          'disabledRules', resourceConfig, 'disableRule');
      if (settingName == null) return;

      const disabledRulesSetting: {[language: string]: string[]} =
          resourceConfig.get(settingName, {});

      for (const language in params.ruleIds) {
        if (!Object.prototype.hasOwnProperty.call(params.ruleIds, language)) continue;
        let disabledRules: string[] = ((disabledRulesSetting[language] != null) ?
            disabledRulesSetting[language] : []);
        disabledRules = disabledRules.concat(params.ruleIds[language]);
        disabledRulesSetting[language] = TelemetryProcessor.cleanUpStringArray(disabledRules);
      }

      TelemetryProcessor.setSetting(
          settingName, disabledRulesSetting, resourceConfig, 'disableRule');

    } else if (params.command === 'ltex.ignoreRulesInSentence') {
      const ruleIds: string[] = params.ruleIds;
      const sentencePatterns: string[] = params.sentencePatterns;
      const ignoredRules: any[] = resourceConfig.get('ignoreRuleInSentence', []);

      for (let i: number = 0; i < ruleIds.length; i++) {
        ignoredRules.push({'rule': ruleIds[i], 'sentence': sentencePatterns[i]});
      }

      TelemetryProcessor.setSetting(
          'ignoreRuleInSentence', ignoredRules, resourceConfig, 'ignoreRuleInSentence');

    } else {
      Logger.warn(i18n('unknownCommandInTelemetryEvent', params.command, params));
    }
  }

  private static getKeys(obj: any): string[] {
    const result: string[] = [];

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) result.push(key);
    }

    return result;
  }

  private newProgressCallback(): void {
    if (this._statusBarMessageDisposable != null) return;
    const uris: string[] = TelemetryProcessor.getKeys(this._progressMap);
    const now: number = Date.now();

    for (const uri of uris) {
      if (now - this._progressMap[uri].startTime >= 5000) {
        this._statusBarMessageDisposable =
            Code.window.setStatusBarMessage(`$(loading~spin) ${i18n('ltexIsChecking')}`, 300000);
        this._context.subscriptions.push(this._statusBarMessageDisposable);
        break;
      }
    }
  }

  private processProgress(params: any): void {
    if (params.operation != 'checkDocument') {
      Logger.warn(i18n('unknownOperationInTelemetryEvent', params.operation, params));
      return;
    }

    if (params.progress == 1) {
      if (Object.prototype.hasOwnProperty.call(this._progressMap, params.uri)) {
        delete this._progressMap[params.uri];
        const uris: string[] = TelemetryProcessor.getKeys(this._progressMap);

        if ((uris.length == 0) && (this._statusBarMessageDisposable != null)) {
          this._statusBarMessageDisposable.dispose();
          this._statusBarMessageDisposable = null;
        }
      }
    } else {
      this._progressMap[params.uri] = {progress: params.progress, startTime: Date.now()};

      if (this._statusBarMessageDisposable == null) {
        setTimeout(this.newProgressCallback.bind(this), 5100);
      }
    }
  }

  public process(params: any): void {
    if (!Object.prototype.hasOwnProperty.call(params, 'type')) {
      Logger.warn(i18n('missingTypeInTelemetryEvent', params));
    } else if (params.type == 'command') {
      this.processCommand(params);
    } else if (params.type == 'progress') {
      this.processProgress(params);
    } else {
      Logger.warn(i18n('unknownTypeInTelemetryEvent', params.type, params));
    }
  }
}
