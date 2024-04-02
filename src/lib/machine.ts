import { createActorContext } from "@xstate/react";
import { setup } from "xstate";

export const machine = setup({
  types: {
    context: {} as { imagePath: string | null },
    events: {} as
      | { type: "next" }
      | { type: "back" }
      | { type: "error" }
      | { type: "done"; newImagePath: string }
      | { type: "add-text" }
      | { type: "file-upload"; newImagePath: string }
      | { type: "add-outline" }
      | { type: "remove-bg" }
      | { type: "ai-generate" },
  },
  actions: {
    reset: function ({ context }) {
      context.imagePath = null;
    },
    set: function ({ context, event }) {
      if (event.type === "done" || event.type === "file-upload") {
        context.imagePath = event.newImagePath;
      }
    },
  },
  schemas: {
    events: {
      next: {
        type: "object",
        properties: {},
      },
      back: {
        type: "object",
        properties: {},
      },
      error: {
        type: "object",
        properties: {},
      },
      done: {
        type: "object",
        properties: {
          newImagePath: {
            type: "string",
          },
        },
      },
      "add-text": {
        type: "object",
        properties: {},
      },
      "file-upload": {
        type: "object",
        properties: {
          newImagePath: {
            type: "string",
          },
        },
      },
      "add-outline": {
        type: "object",
        properties: {},
      },
      "remove-bg": {
        type: "object",
        properties: {},
      },
      "ai-generate": {
        type: "object",
        properties: {
          // prompt: {
          //   type: "string",
          // },
          // model: {
          //   type: "string",
          // },
        },
      },
    },
    context: {
      imagePath: {
        type: "string",
        description: "",
      },
    },
  },
}).createMachine({
  context: { imagePath: null },
  id: "Machine",
  initial: "Initial state",
  states: {
    "Initial state": {
      on: {
        "ai-generate": {
          target: "Loading",
        },
        "file-upload": {
          target: "Image Editting",
          actions: {
            type: "set",
          },
        },
      },
    },
    Loading: {
      tags: ["loading"],
      on: {
        done: {
          target: "Image Editting",
          actions: {
            type: "set",
          },
        },
        error: {
          target: "Initial state",
          actions: {
            type: "reset",
          },
        },
      },
    },
    "Image Editting": {
      initial: "Idle",
      on: {
        back: {
          target: "Initial state",
          actions: {
            type: "reset",
          },
        },
      },
      states: {
        Idle: {
          on: {
            "add-outline": {
              target: "Editting outline",
            },
            "add-text": {
              target: "Adding text",
            },
            "remove-bg": {
              target: "Removing BG",
            },
          },
        },
        "Editting outline": {
          tags: ["loading"],
          on: {
            done: {
              target: "Idle",
              actions: {
                type: "set",
              },
            },
            error: {
              target: "Idle",
            },
          },
        },
        "Adding text": {
          on: {
            done: {
              target: "Idle",
              actions: {
                type: "set",
              },
            },
            error: {
              target: "Idle",
            },
          },
        },
        "Removing BG": {
          tags: ["loading"],
          on: {
            done: {
              target: "Idle",
              actions: {
                type: "set",
              },
            },
            error: {
              target: "Idle",
            },
          },
        },
      },
    },
  },
});

export const MachineContext = createActorContext(machine);
