import * as Code from 'vscode';
import * as Fs from 'fs';
import * as Os from 'os';
import * as Path from 'path';
import * as Querystring from 'querystring';

import Dependencies from './Dependencies';
import {i18n} from './I18n';
import Logger from './Logger';

export default class BugReporter {
  private _context: Code.ExtensionContext;
  private _dependencies: Dependencies;

  private static _howToUrl: string = 'https://valentjn.github.io/vscode-ltex/docs/' +
      'contributing-code-issues.html#how-to-report-bugs';
  private static _reportBugUrl: string = 'https://github.com/valentjn/vscode-ltex/issues/new?' +
      'assignees=&labels=1-bug%2C+2-unconfirmed&title=&body=';

  public constructor(context: Code.ExtensionContext, dependencies: Dependencies) {
    this._context = context;
    this._dependencies = dependencies;
  }

  private createReport(): string {
    const templatePath: string = Path.resolve(
        this._context.extensionPath, '.github', 'ISSUE_TEMPLATE', 'bug-report.md');
    let bugReport: string = Fs.readFileSync(templatePath, {encoding: 'utf-8'});
    let pos: number;

    pos = bugReport.indexOf('---');

    if (pos > -1) {
      pos = bugReport.indexOf('---', pos + 3);

      if (pos > -1) {
        pos = bugReport.indexOf('**', pos + 3);
        if (pos > -1) bugReport = bugReport.substring(pos);
      }
    }

    if (Code.window.activeTextEditor != null) {
      const document: Code.TextDocument = Code.window.activeTextEditor.document;
      let codeLanguage: string;

      switch (document.languageId) {
        case 'latex': {
          codeLanguage = 'latex';
          break;
        }
        case 'markdown': {
          codeLanguage = 'markdown';
          break;
        }
        default: {
          codeLanguage = 'plaintext';
          break;
        }
      }

      pos = bugReport.indexOf('REPLACE_THIS_WITH_SAMPLE_DOCUMENT');

      if (pos > -1) {
        pos = bugReport.lastIndexOf('```', pos);

        if (pos > -1) {
          bugReport = bugReport.substring(0, pos + 3) + codeLanguage + bugReport.substring(pos + 3);
        }
      }

      bugReport = bugReport.replace('REPLACE_THIS_WITH_SAMPLE_DOCUMENT', document.getText());
    }

    const config: any = JSON.parse(JSON.stringify(Code.workspace.getConfiguration('ltex')));

    for (const name in config) {
      if (!Object.prototype.hasOwnProperty.call(config, name)) continue;

      if ((config[name] != null) &&
            (Object.prototype.hasOwnProperty.call(config[name], 'dictionary')) &&
            (Object.prototype.hasOwnProperty.call(config[name], 'disabledRules')) &&
            (Object.prototype.hasOwnProperty.call(config[name], 'enabledRules')) &&
            (JSON.stringify(config[name].dictionary) === '[]') &&
            (JSON.stringify(config[name].disabledRules) === '[]') &&
            (JSON.stringify(config[name].enabledRules) === '[]')) {
        delete config[name];
      }
    }

    const configJson: string = JSON.stringify(config, null, 2);
    bugReport = bugReport.replace('REPLACE_THIS_WITH_LTEX_CONFIGURATION', configJson);

    bugReport = bugReport.replace('REPLACE_THIS_WITH_LTEX_LANGUAGE_SERVER_LOG',
        Logger.serverOutputChannel.getContents());
    bugReport = bugReport.replace('REPLACE_THIS_WITH_LTEX_LANGUAGE_CLIENT_LOG',
        Logger.clientOutputChannel.getContents());

    const platform: string = `${Os.type} (${Os.platform}), ${Os.arch}, ${Os.release}`;
    bugReport = bugReport.replace(/^- Operating system: .*$/, `- Operating system: ${platform}`);

    bugReport = bugReport.replace(/^- VS Code: .*$/, `- VS Code: ${Code.version}`);

    const extension: Code.Extension<any> | undefined =
        Code.extensions.getExtension('valentjn.vscode-ltex');

    if (extension != null) {
      bugReport = bugReport.replace(/^- vscode-ltex: .*$/,
          `- vscode-ltex: ${extension.packageJSON.version}`);
    }

    if (this._dependencies != null) {
      const ltexLsVersion: string | null = this._dependencies.ltexLsVersion;

      if (ltexLsVersion != null) {
        bugReport = bugReport.replace(/^- ltex-ls: .*$/, `- ltex-ls: ${ltexLsVersion}`);
      }

      const javaVersion: string | null = this._dependencies.javaVersion;

      if (javaVersion != null) {
        bugReport = bugReport.replace(/^- Java: .*$/, `- Java: ${javaVersion}`);
      }
    }

    return bugReport;
  }

  public report(): void {
    Logger.log(i18n('creatingBugReport'));
    const bugReport: string = this.createReport();

    Code.window.showInformationMessage(i18n('thanksForHelpingToImproveLtex'),
          i18n('howToReportBugs'), i18n('copyReportAndCreateIssue')).then(
          async (selectedItem: string | undefined) => {
      if (selectedItem == i18n('howToReportBugs')) {
        Code.env.openExternal(Code.Uri.parse(BugReporter._howToUrl));
      } else if (selectedItem == i18n('copyReportAndCreateIssue')) {
        Code.env.clipboard.writeText(bugReport);
        Code.env.openExternal(Code.Uri.parse(BugReporter._reportBugUrl +
            Querystring.escape(i18n('enterSummaryOfIssueInTitleFieldAndReplaceSentence'))));
      }
    });
  }
}
