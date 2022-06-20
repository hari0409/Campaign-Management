import React from "react";
import { Form, Input, Button, Message } from "semantic-ui-react";

function Contribute({
  contribution,
  setContribution,
  submitHandler,
  errorMsg,
  contributeMsg,
  status,
  min,
}) {
  return (
    <>
      <Form
        onSubmit={submitHandler}
        error={Boolean(errorMsg)}
        success={Boolean(contributeMsg)}
      >
        <Form.Field>
          <label>Your Contribution</label>
          <Input
            label="ether"
            labelPosition="right"
            value={contribution}
            onChange={(e) => setContribution(e.target.value)}
            required={true}
            placeholder={`Minimum Contribution of ${min} ether`}
          />
        </Form.Field>
        <Message error header="Ooops! An Error occurred" content={errorMsg} />
        {contributeMsg && (
          <>
            <Message success header="Success" content={contributeMsg} />
          </>
        )}
        <Button type="submit" loading={status} color="pink">
          Contribute to Campaign!
        </Button>
      </Form>
    </>
  );
}

export default Contribute;
