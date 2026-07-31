import "./PasswordValidation.scss";

const passwordRules = [
  {
    key: "capitalLetter",
    text: "Contains an uppercase letter",
    regex: /[A-Z]/,
  },
  {
    key: "smallLetter",
    text: "Contains a lowercase letter",
    regex: /[a-z]/,
  },
  {
    key: "number",
    text: "Contains a number",
    regex: /\d/,
  },
  {
    key: "specialCharacter",
    text: "Contains a special character",
    regex: /[^A-Za-z0-9]/,
  },
  {
    key: "minLength",
    text: "At least 8 characters",
    regex: /^.{8,}$/,
  },
];

const PasswordValidation = ({ password }) => {
  return (
    <div className="password-validation">
      <p className="validation-title">Password must contain:</p>

      <ul>
        {passwordRules.map((rule) => {
          const passed = rule.regex.test(password);

          return (
            <li key={rule.key} className={passed ? "passed" : ""}>
              {rule.text}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PasswordValidation;
