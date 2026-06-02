const clients = [
    {
        id: "CL-10024",
        portfolioId: "PF-8801",
        firstName: "Amelia",
        lastName: "Reed",
        segment: "Private Banking",
        advisor: "M. Carter",
        riskProfile: "Balanced"
    },
    {
        id: "CL-10031",
        portfolioId: "PF-8817",
        firstName: "Daniel",
        lastName: "Kovacs",
        segment: "Wealth",
        advisor: "S. Ivanova",
        riskProfile: "Growth"
    },
    {
        id: "CL-10047",
        portfolioId: "PF-8840",
        firstName: "Sophia",
        lastName: "Bennett",
        segment: "Retail Plus",
        advisor: "L. Morgan",
        riskProfile: "Conservative"
    },
    {
        id: "CL-10058",
        portfolioId: "PF-8862",
        firstName: "Marcus",
        lastName: "Hale",
        segment: "Private Banking",
        advisor: "M. Carter",
        riskProfile: "Income"
    },
    {
        id: "CL-10073",
        portfolioId: "PF-8894",
        firstName: "Elena",
        lastName: "Petrova",
        segment: "Wealth",
        advisor: "S. Ivanova",
        riskProfile: "Balanced"
    }
];

export const goLondon = async (io) => {
    console.log('Attempting to connect to London app...');

    await io.interop.register("user_greeting", (args = { name }) => {
        console.log(`Received invocation with name: ${args.name}`);

        return {
            greeting: `Hello from the London app, ${args.name}!`
        }
    });

    await io.interop.register("get_clients", () => {

        console.log('Received invocation for get_clients');
        console.log('Returning clients:', clients);

        return {
            success: true,
            clients
        }
    });
}