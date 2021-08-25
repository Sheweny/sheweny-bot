import { Button, ShewenyClient } from "sheweny";
import type { ButtonInteraction } from "discord.js";

export class Btns1And2 extends Button {
  constructor(client: ShewenyClient) {
    super(client, ["ruleCheck"]);
  }
  execute(button: ButtonInteraction) {
    return button.reply({
      content: "It's good you can read, now you have to apply them",
      ephemeral: true,
    });
  }
}
