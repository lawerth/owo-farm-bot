import { logger } from "../utils/logger.js";

export const commandHandler = async (agent) => {
    agent.on("messageCreate", async (message) => {
        const prefixes = Array.isArray(agent.config.prefix)
            ? agent.config.prefix
            : [agent.config.prefix];

        const matchedPrefix = prefixes.find((p) => message.content.startsWith(p));
        if (!matchedPrefix) return;

        if (
            message.author.id != agent.config.adminID &&
            message.author.id != message.client.user?.id
        )
            return;

        logger.debug(message.author.username + " executed a command: " + message.content);

        const args = message.content
            .slice(matchedPrefix.length)
            .trim()
            .split(/ +/);

        const command = agent.commands.get(args.shift()?.toLowerCase() ?? "");
        if (!command) return;

        try {
            command.execute(agent, message, ...args);
        } catch (error) {
            logger.error("Error executing command: " + command);
            logger.error(error);
        }
    });
};