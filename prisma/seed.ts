import { CannabisStrain, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
enum CannabisStraintype {
  Indica = "Indica",
  Sativa = "Sativa",
  Hybrid = "Hybrid",
}

async function main() {
  const cannabisStrains = [
    // Add more cannabis strains here
    {
      name: "Blue Dream",
      description:
        "Blue Dream is a sativa-dominant hybrid that combines the best traits of its parent strains, Blueberry and Haze. It offers a sweet berry aroma and delivers a balanced high, providing a relaxed body sensation while keeping the mind clear and focused.",
      flavors: ["blueberry", "sweet", "vanilla", "herbal"],
      effects: [
        "euphoria",
        "relaxation",
        "creativity",
        "happiness",
      ],
      type: CannabisStraintype.Hybrid,
    },
    {
      name: "Girl Scout Cookies",
      description:
        "Girl Scout Cookies, also known as GSC, is a potent hybrid that gained popularity for its unique flavor profile and powerful effects. It offers a blend of sweet and earthy flavors with hints of mint. The high is characterized by full-body relaxation and a cerebral euphoria that uplifts the mood.",
      flavors: ["sweet", "earthy", "mint", "spicy"],
      effects: [
        "euphoria",
        "relaxation",
        "happiness",
        "creativity",
      ],
      type: CannabisStraintype.Hybrid,
    },
    {
      name: "Gorilla Glue",
      description:
        "Gorilla Glue, also known as GG4, is an indica-dominant hybrid that is highly regarded for its powerful effects and sticky resinous buds. It has a pungent aroma with notes of earth and diesel. The high is intense and long-lasting, providing a deep relaxation that can glue you to the couch.",
      flavors: ["earthy", "diesel", "pine", "spicy"],
      effects: [
        "relaxation",
        "euphoria",
        "happiness",
        "sedation",
      ],
      type: CannabisStraintype.Indica,
    },
    {
      name: "OG Kush",
      description:
        "OG Kush is a legendary strain with a name that has recognition even outside of the cannabis world. OG Kush is cherished for its ability to crush stress under the weight of its heavy euphoria. It carries an earthy pine and sour lemon scent with woody undertones, an aroma that has become the signature of OG Kush varieties and descendants.",
      flavors: ["earthy", "pine", "sour", "lemon", "woody"],
      effects: [
        "euphoria",
        "relaxation",
        "happiness",
        "uplifted",
        "creativity",
        "focused",
      ],
      type: CannabisStraintype.Hybrid,
    },
    {
      name: "AK-47",
      description:
        "AK-47 is a sativa-dominant hybrid that delivers a steady and long-lasting cerebral buzz that keeps you mentally alert and engaged in creative or social activities. Its flavor profile combines earthy, floral, and sweet notes, making it a popular choice among cannabis enthusiasts.",
      flavors: ["earthy", "floral", "sweet", "spicy"],
      effects: [
        "euphoria",
        "energy",
        "creativity",
        "relaxation",
      ],
      type: CannabisStraintype.Hybrid,
    },
    {
      name: "Northern Lights",
      description:
        "Northern Lights is an indica strain renowned for its resinous buds, pungent aroma, and potent relaxation effects. It offers a sweet and spicy flavor profile with hints of pine. Northern Lights is widely appreciated for its ability to relax the body and ease the mind, making it a go-to strain for stress relief and sleep aid.",
      flavors: ["sweet", "spicy", "pine", "earthy"],
      effects: [
        "relaxation",
        "euphoria",
        "sleepiness",
        "happiness",
      ],
      type: CannabisStraintype.Hybrid,
    },
    {
      name: "Sour Diesel",
      description:
        "Sour Diesel is a highly popular sativa-dominant strain known for its energizing and uplifting effects. It features a distinctive fuel-like aroma with undertones of citrus and earthiness. Sour Diesel is often chosen by those seeking a potent and long-lasting cerebral experience that boosts focus, creativity, and motivation.",
      flavors: ["citrus", "diesel", "earthy", "spicy"],
      effects: ["euphoria", "energy", "focus", "creativity"],
      type: CannabisStraintype.Hybrid,
    },
    {
      name: "Jack Herer",
      description:
        "Jack Herer is a sativa-dominant strain named after the renowned cannabis activist and author. It has a spicy and earthy aroma with hints of pine. The high is uplifting and cerebral, providing a burst of creativity and focus.",
      flavors: ["spicy", "earthy", "pine", "citrus"],
      effects: ["euphoria", "creativity", "focus", "happiness"],
      type: CannabisStraintype.Hybrid,
    },
    {
      name: "White Widow",
      description:
        "White Widow is a classic hybrid strain known for its white, frosty appearance and potent effects. It offers a balanced high with a combination of cerebral euphoria and relaxing body sensations. The aroma is a mix of earthy and floral notes.",
      flavors: ["earthy", "floral", "sweet", "spicy"],
      effects: [
        "euphoria",
        "relaxation",
        "creativity",
        "happiness",
      ],
      type: CannabisStraintype.Indica,
    },
    {
      name: "Super Lemon Haze",
      description:
        "Super Lemon Haze is a sativa-dominant strain that combines Lemon Skunk and Super Silver Haze. It has a zesty lemon aroma with undertones of citrus and earth. The high is uplifting and energetic, providing a burst of creativity and a happy, euphoric feeling.",
      flavors: ["lemon", "citrus", "sweet", "spicy"],
      effects: [
        "euphoria",
        "energizing",
        "happiness",
        "creativity",
      ],
      type: CannabisStraintype.Sativa,
    },
    {
      name: "Jack Herer",
      description:
        "Jack Herer is a sativa-dominant strain named after the famous cannabis activist and author. It has a spicy and piney aroma with hints of citrus. The high is uplifting and clear-headed, promoting creativity and focus, while still providing a relaxed and euphoric experience.",
      flavors: ["spicy", "pine", "citrus", "earthy"],
      effects: [
        "euphoria",
        "creativity",
        "focus",
        "relaxation",
      ],
      type: CannabisStraintype.Hybrid,
    },
    {
      name: "Wedding Cake",
      description:
        "Wedding Cake is an indica-dominant hybrid known for its sweet and vanilla-like aroma. It has dense buds covered in a thick layer of trichomes. The high is calming and euphoric, providing a sense of relaxation and happiness.",
      flavors: ["sweet", "vanilla", "earthy", "spicy"],
      effects: [
        "relaxation",
        "euphoria",
        "happiness",
        "creativity",
      ],
      type: CannabisStraintype.Hybrid,
    },
    {
      name: "Green Crack",
      description:
        "Green Crack is a potent sativa strain that delivers an invigorating and energizing high. It has a fruity and tropical aroma with notes of citrus. The effects are known to boost focus, creativity, and productivity.",
      flavors: ["citrus", "tropical", "sweet", "earthy"],
      effects: ["energy", "focus", "happiness", "creativity"],
      type: CannabisStraintype.Hybrid,
    },
    {
      name: "Gelato",
      description:
        "Gelato is a hybrid strain that offers a delicious dessert-like flavor profile. It combines the sweet and creamy taste of Gelato with a hint of citrus. The high is known for its euphoric and relaxing effects, providing a balanced experience.",
      flavors: ["sweet", "creamy", "citrus", "fruity"],
      effects: [
        "euphoria",
        "relaxation",
        "happiness",
        "creativity",
      ],
      type: CannabisStraintype.Hybrid,
    },
    {
      name: "Bruce Banner",
      description:
        "Bruce Banner is a potent hybrid strain named after the alter ego of the Hulk. It has a sweet and diesel-like aroma with earthy undertones. The high is characterized by a powerful euphoria and creative energy, gradually transitioning into deep relaxation.",
      flavors: ["sweet", "diesel", "earthy", "spicy"],
      effects: [
        "euphoria",
        "energy",
        "relaxation",
        "creativity",
      ],
      type: CannabisStraintype.Hybrid,
    },
  ];

  for (const strain of cannabisStrains) {
    const createdStrain = await prisma.cannabisStrain.upsert({
      where: { name: strain.name },
      update: {},
      create: {
        name: strain.name,
        description: strain.description,
        flavors: strain.flavors,
        effects: strain.effects,
        type: strain.type,
      },
    });

    console.log(
      `Created Cannabis Strain: ${createdStrain.name}`
    );
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
