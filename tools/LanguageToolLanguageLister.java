import org.languagetool.Language;
import org.languagetool.Languages;

public class LanguageToolLanguageLister {
  public static void main(String[] args) {
    for (Language language : Languages.get()) {
      System.out.println(language.getShortCodeWithCountryAndVariant() + ";" + language.getName());
    }
  }
}
