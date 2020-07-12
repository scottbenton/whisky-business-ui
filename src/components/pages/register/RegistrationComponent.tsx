import React from "react";
import { Button } from "components/shared/Button";
import { Form } from "react-final-form";
import {
  RegistrationForm,
  IRegistrationForm,
} from "classes/fields/RegistrationFields";
import { TextFormField } from "components/shared/TextInput/TextFormField";
import { Alert } from "components/shared/Alert";
import { useAuth } from "providers/AuthProvider";
import { useHistory } from "react-router-dom";
import { pageConfig } from "pages";

const handleValidate = async (values: IRegistrationForm) => {
  let form = new RegistrationForm(values);
  return form.validate();
};

export interface RegistrationComponentProps {
  setRegistrationFields: (form: IRegistrationForm) => void;
}

export const RegistrationComponent: React.FC<RegistrationComponentProps> = (
  props
) => {
  const { setRegistrationFields } = props;

  const { signUp } = useAuth();
  const history = useHistory();

  const [error, setError] = React.useState<Error | undefined>();

  const onSubmit = async (values: IRegistrationForm) => {
    const formValues = new RegistrationForm(values);
    setError(undefined);
    try {
      await signUp(formValues);
      setRegistrationFields(values);
    } catch (e) {
      setError(e);
    }
  };

  const handleCancel = () => {
    history.push(pageConfig.home.path);
  };

  return (
    <>
      {error && (
        <Alert type={"error"} title={"Error"} message={error.message} />
      )}
      <Form
        onSubmit={onSubmit}
        validate={handleValidate}
        render={({ handleSubmit, pristine, submitting }) => (
          <form
            onSubmit={handleSubmit}
            autoComplete={"no"}
            data-testid={"registration-form"}
          >
            <div className={"flex"}>
              <TextFormField
                fieldName={"firstName"}
                id="first-name"
                placeholder={"Scott"}
                label={"First Name"}
                required={true}
                className={"mr-2"}
              />
              <TextFormField
                fieldName={"lastName"}
                id="last-name"
                placeholder={"Benton"}
                label={"Last Name"}
                required={true}
                className={"ml-2"}
              />
            </div>
            <TextFormField
              fieldName={"email"}
              id="email"
              placeholder={"scott@scottbenton.dev"}
              label={"Email Address"}
              required={true}
              helperText={"Your email will be used to log you in in the future"}
            />
            <TextFormField
              fieldName={"password"}
              id="password"
              label={"Password"}
              required={true}
              type={"password"}
              helperText={"Password must include letters & numbers"}
            />
            <TextFormField
              fieldName={"confirmPassword"}
              id="password-confirm"
              label={"Confirm Password"}
              required={true}
              type={"password"}
            />
            <div className={"flex justify-end mt-4 mb-2"}>
              <Button
                id={"cancel"}
                type={"button"}
                onClick={handleCancel}
                containerClassName={"mr-1"}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                id={"create-account"}
                type={"submit"}
                variant={"contained"}
                color={"primary"}
                disabled={pristine || submitting}
                loading={submitting}
              >
                Create Account
              </Button>
            </div>
          </form>
        )}
      />
    </>
  );
};
