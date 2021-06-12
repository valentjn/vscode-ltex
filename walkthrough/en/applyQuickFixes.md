# Apply Quick Fixes

When moving your mouse over an error, LT<sub>E</sub>X shows a message with details.

For example, when you hover over `speling` in this Markdown example&hellip;

```markdown
This is a sentence *with a speling error in it.*
```

&hellip; LT<sub>E</sub>X will show the following message:

```plaintext
'speling': Possible spelling mistake found. – MORFOLOGIK_RULE_EN_US
```

You can fix the error by selecting *Quick Fix...* below the message. For the example above, the following quick fixes will be shown:

- Use 'spelling'
- Use 'spewing'
- Use 'spieling'
- Add 'speling' to dictionary
- Hide false positive
- Disable rule

Tip: If the text editor cursor is at an error, you can press `Ctrl+.` (Control and period keys) to show the menu of available quick fixes without having to move the mouse.
