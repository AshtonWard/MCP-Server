export default {
  name: "echo",
  schema: {
    type: "object",
    properties: {
      text: { type: "string" }
    },
    required: ["text"]
  },
  handler: async ({ text }) => {
    return { result: `You said: ${text}` };
  }
};
