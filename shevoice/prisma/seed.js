const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash("hershield123", 10)

  const ngos = [
    // 🇿🇦 South Africa
    {
      name: "Rape Crisis Cape Town",
      phone: "+27214476130",
      email: "info@rapecrisis.org.za",
      password,
      region: "South Africa",
    },
    {
      name: "People Opposing Women Abuse",
      phone: "+265999000001",
      email: "powa@powa.co.za",
      password,
      region: "South Africa",
    },
    {
      name: "Gender Links",
      phone: "+27113396072",
      email: "info@genderlinks.org.za",
      password,
      region: "South Africa",
    },
    // 🇳🇬 Nigeria
    {
      name: "WOTCLEF Nigeria",
      phone: "+2348033000000",
      email: "info@wotclef.org",
      password,
      region: "Nigeria",
    },
    // 🇰🇪 Kenya
    {
      name: "FIDA Kenya",
      phone: "+254202719819",
      email: "info@fidakenya.org",
      password,
      region: "Kenya",
    },
    // 🇲🇼 Malawi
    {
      name: "Women and Children First Malawi",
      phone: "+2651758090",
      email: "info@wcfmalawi.org",
      password,
      region: "Malawi",
    },
    {
      name: "Eye of the Child",
      phone: "+2651751515",
      email: "info@eyeofthechild.org",
      password,
      region: "Malawi",
    },
    {
      name: "Centre for Human Rights and Rehabilitation",
      phone: "+2651751661",
      email: "chrr@chrrmw.org",
      password,
      region: "Malawi",
    },
    {
      name: "National Organisation for Women in Malawi",
      phone: "+2651754781",
      email: "nowmal@nowmalawi.org",
      password,
      region: "Malawi",
    },
    {
      name: "Young Women Leaders Network Malawi",
      phone: "+265991234567",
      email: "info@ywlnmalawi.org",
      password,
      region: "Malawi",
    },
  ]

  for (const ngo of ngos) {
    await prisma.ngo.create({ data: ngo })
  }

  console.log("✅ NGOs seeded with passwords!")
  console.log(`🇿🇦 South Africa: 3 orgs`)
  console.log(`🇳🇬 Nigeria: 1 org`)
  console.log(`🇰🇪 Kenya: 1 org`)
  console.log(`🇲🇼 Malawi: 5 orgs`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())