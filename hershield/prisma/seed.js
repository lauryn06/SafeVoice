const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
  const ngos = [
    {
      name: "Rape Crisis Cape Town",
      phone: "+27214476130",
      email: "info@rapecrisis.org.za",
      region: "South Africa",
    },
    {
      name: "People Opposing Women Abuse",
      phone: "+27118424345",
      email: "powa@powa.co.za",
      region: "South Africa",
    },
    {
      name: "Gender Links",
      phone: "+27113396072",
      email: "info@genderlinks.org.za",
      region: "South Africa",
    },
    {
      name: "WOTCLEF Nigeria",
      phone: "+2348033000000",
      email: "info@wotclef.org",
      region: "Nigeria",
    },
    {
      name: "FIDA Kenya",
      phone: "+254202719819",
      email: "info@fidakenya.org",
      region: "Kenya",
    },
  ]

  for (const ngo of ngos) {
    await prisma.ngo.create({ data: ngo })
  }

  console.log("✅ NGOs seeded successfully!")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())