import * as Code from 'vscode';
import * as Fs from 'fs';
import * as Path from 'path';

import Logger from './Logger';

type MessageObject = {
  [key: string]: string;
};

interface VSCodeNlsConfig {
  locale: string;
  availableLanguages: {
    [pack: string]: string;
  };
  _languagePackSupport?: boolean;
  _languagePackId?: string;
  _translationsConfigFile?: string;
  _cacheRoot?: string;
  _corruptedFile: string;
}

export class I18n {
  private static _language: string;
  private static _messages: MessageObject;
  private static _defaultMessages: MessageObject;

  public static initialize(context: Code.ExtensionContext): void {
    this._language = I18n.getLanguage();
    Logger.log(`Setting LTeX UI language to '${this._language}'.`);
    Logger.log('Loading i18n messages...');
    this._messages = I18n.loadMessages(context);
    Logger.log('Loading default i18n messages...');
    this._defaultMessages = I18n.loadDefaultMessages(context);
  }

  public static getLanguage(): string {
    let language: string = 'en-US';
    const codeNlsConfigStr: string | undefined = process.env['VSCODE_NLS_CONFIG'];

    if (codeNlsConfigStr != null) {
      try {
        const codeNlsConfig: VSCodeNlsConfig = JSON.parse(codeNlsConfigStr) as VSCodeNlsConfig;
        language = codeNlsConfig.locale;
      } catch {
        // ignore errors, use default language
      }
    }

    return language;
  }

  public static loadMessages(context: Code.ExtensionContext): MessageObject {
    let language: string = this._language.replace(/[^A-Za-z0-9\-_]/g, '');

    while (true) {
      const filePath: string = Path.resolve(context.extensionPath, 'i18n',
          `messages.nls.${language}.json`);

      if (Fs.existsSync(filePath)) {
        return I18n.loadMessagesFile(filePath);
      } else {
        const index: number = language.indexOf('-');

        if (index >= 0) {
          language = language.substr(0, index);
        } else {
          return I18n.loadDefaultMessages(context);
        }
      }
    }
  }

  public static loadDefaultMessages(context: Code.ExtensionContext): MessageObject {
    return I18n.loadMessagesFile(Path.resolve(context.extensionPath, 'i18n', 'messages.nls.json'));
  }

  public static loadMessagesFile(filePath: string): MessageObject {
    const fileContents: string = Fs.readFileSync(filePath, {encoding: 'utf-8'});
    return JSON.parse(fileContents);
  }

  public static getMessage(key: string): string {
    if (Object.prototype.hasOwnProperty.call(this._messages, key)) {
      return this._messages[key];
    } else if (Object.prototype.hasOwnProperty.call(this._defaultMessages, key)) {
      return this._defaultMessages[key];
    } else {
      Logger.warn(`Could not find i18n message key '${key}'.`);
      return key;
    }
  }

  public static i18n(key: string, ...messageArguments: any[]): string {
    return I18n.getMessage(key).replace(/\{(\d+)\}/g, (_match: string, groups: string[]) => {
      return String(messageArguments[parseInt(groups[0])]);
    });
  }
}

const i18n: (key: string, ...messageArguments: any[]) => string = I18n.i18n;
export {i18n};
