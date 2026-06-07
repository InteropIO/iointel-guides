export const GET_CLIENTS_METHOD = "getClients";

export interface Client {
    id: string;
    portfolioId: string;
    firstName: string;
    lastName: string;
    segment: string;
    advisor: string;
    riskProfile: string;
}

export const clients: Client[] = [
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
