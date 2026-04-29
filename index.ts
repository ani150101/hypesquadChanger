import definePlugin from "@utils/types";
import { findByProps } from "@webpack";
import { ApplicationCommandOptionType } from "@api/Commands";

export default definePlugin({
    name: "HypeSquad Changer",
    description: "Easily change or leave your HypeSquad house.",
    authors: [{ 
        name: "Mr. Robot", 
        id: 426234414255570959n 
    }], 
    
    commands: [{
        name: "hypesquad",
        description: "Change or leave your HypeSquad house",
        options: [
            {
                name: "house",
                description: "Which house do you want to join? (Or choose Leave)",
                type: ApplicationCommandOptionType.INTEGER,
                required: true,
                choices: [
                    { name: "Bravery", value: 1 },
                    { name: "Brilliance", value: 2 },
                    { name: "Balance", value: 3 },
                    { name: "Leave HypeSquad", value: 0 }
                ]
            }
        ],
        execute: async (args) => {
            const houseId = args[0].value;
            
            const TokenStore = findByProps("getToken");
            const token = TokenStore?.getToken();

            if (!token) {
                return { content: "❌ Could not find your Discord token." };
            }

            try {
                if (houseId === 0) {
                    const response = await fetch("https://discord.com/api/v9/hypesquad/online", {
                        method: "DELETE",
                        headers: {
                            "Authorization": token
                        }
                    });

                    if (response.ok) {
                        return { content: "💨 Successfully left HypeSquad and removed your badge!" };
                    } else {
                        return { content: `⚠️ Failed to leave HypeSquad. Status code: ${response.status}` };
                    }
                } else {
                    const response = await fetch("https://discord.com/api/v9/hypesquad/online", {
                        method: "POST",
                        headers: {
                            "Authorization": token,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ house_id: houseId })
                    });

                    if (response.ok) {
                        const houseNames = { 1: "Bravery", 2: "Brilliance", 3: "Balance" };
                        return { content: `✨ Successfully joined the Hypesquad House of **${houseNames[houseId as keyof typeof houseNames]}**!` };
                    } else {
                        return { content: `⚠️ Failed to change house. Status code: ${response.status}` };
                    }
                }
            } catch (error) {
                return { content: `❌ An error occurred: ${error}` };
            }
        }
    }]
});
