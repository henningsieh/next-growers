import { PrismaClient } from "@prisma/client";

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
      name: "Mimosa x Orange Punch",
      // FAKE DATA
      description:
        "Purple Cookie Kush is a hybrid strain bred by Sensi Seeds, resulting from the cross between Girl Scout Cookies and Purple Kush. With 60% indica and 40% sativa heritage, it offers a well-balanced hybrid experience. Its flavors range from grape to sandalwood, with a terpene profile consisting of complementary aromas. Purple Cookie Kush is a short plant with good yields, featuring dense buds similar to Kush strains.",
      flavors: ["grape", "sandalwood", "spicy", "earthy"],
      effects: ["euphoria", "relaxation", "pain relief", "body high"],
      type: CannabisStraintype.Hybrid,
    },
    {
      name: "Blueberry Cupcake",
      // FAKE DATA
      description:
        "Purple Cookie Kush is a hybrid strain bred by Sensi Seeds, resulting from the cross between Girl Scout Cookies and Purple Kush. With 60% indica and 40% sativa heritage, it offers a well-balanced hybrid experience. Its flavors range from grape to sandalwood, with a terpene profile consisting of complementary aromas. Purple Cookie Kush is a short plant with good yields, featuring dense buds similar to Kush strains.",
      flavors: ["grape", "sandalwood", "spicy", "earthy"],
      effects: ["euphoria", "relaxation", "pain relief", "body high"],
      type: CannabisStraintype.Hybrid,
    },
    {
      name: "Quick One Auto",
      // FAKE DATA
      description:
        "Purple Cookie Kush is a hybrid strain bred by Sensi Seeds, resulting from the cross between Girl Scout Cookies and Purple Kush. With 60% indica and 40% sativa heritage, it offers a well-balanced hybrid experience. Its flavors range from grape to sandalwood, with a terpene profile consisting of complementary aromas. Purple Cookie Kush is a short plant with good yields, featuring dense buds similar to Kush strains.",
      flavors: ["grape", "sandalwood", "spicy", "earthy"],
      effects: ["euphoria", "relaxation", "pain relief", "body high"],
      type: CannabisStraintype.Hybrid,
    },
    {
      name: "Hulkberry Auto",
      // FAKE DATA
      description:
        "Purple Cookie Kush is a hybrid strain bred by Sensi Seeds, resulting from the cross between Girl Scout Cookies and Purple Kush. With 60% indica and 40% sativa heritage, it offers a well-balanced hybrid experience. Its flavors range from grape to sandalwood, with a terpene profile consisting of complementary aromas. Purple Cookie Kush is a short plant with good yields, featuring dense buds similar to Kush strains.",
      flavors: ["grape", "sandalwood", "spicy", "earthy"],
      effects: ["euphoria", "relaxation", "pain relief", "body high"],
      type: CannabisStraintype.Hybrid,
    },
    {
      name: "Green Gelato",
      // FAKE DATA
      description:
        "Purple Cookie Kush is a hybrid strain bred by Sensi Seeds, resulting from the cross between Girl Scout Cookies and Purple Kush. With 60% indica and 40% sativa heritage, it offers a well-balanced hybrid experience. Its flavors range from grape to sandalwood, with a terpene profile consisting of complementary aromas. Purple Cookie Kush is a short plant with good yields, featuring dense buds similar to Kush strains.",
      flavors: ["grape", "sandalwood", "spicy", "earthy"],
      effects: ["euphoria", "relaxation", "pain relief", "body high"],
      type: CannabisStraintype.Hybrid,
    },
    {
      name: "Purple Cookie Kush",
      description:
        "Purple Cookie Kush is a hybrid strain bred by Sensi Seeds, resulting from the cross between Girl Scout Cookies and Purple Kush. With 60% indica and 40% sativa heritage, it offers a well-balanced hybrid experience. Its flavors range from grape to sandalwood, with a terpene profile consisting of complementary aromas. Purple Cookie Kush is a short plant with good yields, featuring dense buds similar to Kush strains.",
      flavors: ["grape", "sandalwood", "spicy", "earthy"],
      effects: ["euphoria", "relaxation", "pain relief", "body high"],
      type: CannabisStraintype.Hybrid,
    },
    {
      name: "Lemon Power Haze",
      description:
        "Lemon Power Haze by Zamnesia Seeds is a feminized hybrid known for its refreshing sweet and lemony taste, coupled with a potent and enjoyable high. This strain is a delight for Sativa lovers, offering energizing effects that boost creativity and motivation, while uplifting mood. It's a perfect choice for daytime use.",
      flavors: ["lemon", "citrus", "skunk", "sweet"],
      effects: ["energizing", "creative", "euphoric", "motivating"],
      type: CannabisStraintype.Hybrid,
    },
    {
      name: "Wedding Gelato",
      description:
        "Wedding Gelato seeds result from a complex genetic combination of Wedding Cake, Gelato, and Gelato 33 strains, resulting in a potent and flavorsome hybrid. Its buds emit sickly sweet aromas with earthy undertones, accompanied by flavors of lemon, mint, and vanilla. With a nearly balanced hybrid profile leaning slightly towards indica, it offers euphoric effects followed by mild muscle relaxation. Buds are potent and compact, boasting vibrant orange hairs against dark green buds. Outdoor harvest is typically in early October, with indoor flowering lasting about 8-10 weeks. Despite a moderate yield, its high THC concentration and rich flavor compensate for it.",
      flavors: ["Citrus", "Earthy", "Fruity", "Herbal"],
      effects: [
        "Calming",
        "Euphoric",
        "Physically Relaxing",
        "Uplifting",
      ],
      type: CannabisStraintype.Hybrid,
    },
    {
      name: "Fast Bud Outdoor",
      description:
        "Fast Bud Outdoor is a mostly sativa variety from Spliff Seeds and can be cultivated outdoors. Spliff Seeds' Fast Bud Outdoor is a THC dominant variety and is/was only available as feminized seeds.",
      flavors: ["floral", "peppery", "sweet", "tangy"],
      effects: ["soft", "uplifting", "energetic"],
      type: CannabisStraintype.Sativa,
    },
    {
      name: "Pineapple Express Auto",
      description:
        "Pineapple Express Auto is an autoflowering hybrid strain known for its short, compact, fast-blossoming indica-dominant phenotype. Indoors, it has a slightly above-average yield and a general impression of being slightly below average. Outdoors, it has a harvest time in the middle of September, with a very low crop yield, making it not recommendable for outdoor cultivation.",
      flavors: [
        "Sweet",
        "Fruity",
        "Floral",
        "Sour",
        "Citrus",
        "Spicy",
        "Orange",
      ],
      effects: ["Activating", "Uplifting", "Appetizing", "Energetic"],
      type: CannabisStraintype.Hybrid,
    },
    {
      name: "Blue Dream",
      description:
        "Blue Dream is a sativa-dominant hybrid that combines the best traits of its parent strains, Blueberry and Haze. It offers a sweet berry aroma and delivers a balanced high, providing a relaxed body sensation while keeping the mind clear and focused.",
      flavors: ["blueberry", "sweet", "vanilla", "herbal"],
      effects: ["euphoria", "relaxation", "creativity", "happiness"],
      type: CannabisStraintype.Hybrid,
    },
    {
      name: "Girl Scout Cookies",
      description:
        "Girl Scout Cookies, also known as GSC, is a potent hybrid that gained popularity for its unique flavor profile and powerful effects. It offers a blend of sweet and earthy flavors with hints of mint. The high is characterized by full-body relaxation and a cerebral euphoria that uplifts the mood.",
      flavors: ["sweet", "earthy", "mint", "spicy"],
      effects: ["euphoria", "relaxation", "happiness", "creativity"],
      type: CannabisStraintype.Hybrid,
    },
    {
      name: "Diesel Auto",
      description:
        "Diesel Automatic bietet die wohlbekannten und beliebten Geschmäcke und Aromen von New York Diesel, während sie dank der autoflowering Genetik von ihrem Lowryder #2-Elternteil schneller die Ernte erreicht. Wie alle neueren autoflowering Hybriden weist sie im Vergleich zu vielen ursprünglichen autoflowering Sorten einen besseren Ertrag und Geschmack auf.",
      flavors: ["diesel", "fruity", "citrus"],
      effects: ["relaxing", "clear-headed"],
      type: CannabisStraintype.Hybrid,
    },
    {
      name: "Gorilla Glue",
      description:
        "Gorilla Glue, also known as GG4, is an indica-dominant hybrid that is highly regarded for its powerful effects and sticky resinous buds. It has a pungent aroma with notes of earth and diesel. The high is intense and long-lasting, providing a deep relaxation that can glue you to the couch.",
      flavors: ["earthy", "diesel", "pine", "spicy"],
      effects: ["relaxation", "euphoria", "happiness", "sedation"],
      type: CannabisStraintype.Indica,
    },
    {
      name: "Mimosa",
      description:
        "Most growers are instantly won over by Mimosa's striking looks. However, she also boasts a bunch of other impressive traits, including high levels of THC and a fragrant mix of terpenes. Plus, her compact stature makes her easy to grow just about anywhere and without much fuss. Despite her small size, Mimosa still pumps out rewarding yields.",
      flavors: ["Earthy", "Sour", "Sweet", "Mint", "Spicy"],
      effects: [
        "Creative",
        "Laughter",
        "Euphoria",
        "Relaxation",
        "Happiness",
      ],
      type: CannabisStraintype.Hybrid,
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
      effects: ["euphoria", "energy", "creativity", "relaxation"],
      type: CannabisStraintype.Hybrid,
    },
    {
      name: "Northern Lights",
      description:
        "Northern Lights is an indica strain renowned for its resinous buds, pungent aroma, and potent relaxation effects. It offers a sweet and spicy flavor profile with hints of pine. Northern Lights is widely appreciated for its ability to relax the body and ease the mind, making it a go-to strain for stress relief and sleep aid.",
      flavors: ["sweet", "spicy", "pine", "earthy"],
      effects: ["relaxation", "euphoria", "sleepiness", "happiness"],
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
      name: "Wedding Gelato",
      description:
        "Wedding Gelato, aka Ice Cream Cake, is the result of a very balanced love triangle. They don't fight to be the dominant variety, but the Wedding Gelato seeds contain the best characteristics of their parental varieties, offering a potent and tasty effect. Inhale the sugary taste of Gelato and the peppery notes of Wedding Cake.",
      flavors: ["sweet", "peppery", "fruity", "herbal", "citrusy"],
      effects: [
        "uplifting",
        "relaxing",
        "euphoric",
        "physically calming",
      ],
      type: CannabisStraintype.Hybrid,
    },
    {
      name: "White Widow",
      description:
        "White Widow is a classic hybrid strain known for its white, frosty appearance and potent effects. It offers a balanced high with a combination of cerebral euphoria and relaxing body sensations. The aroma is a mix of earthy and floral notes.",
      flavors: ["earthy", "floral", "sweet", "spicy"],
      effects: ["euphoria", "relaxation", "creativity", "happiness"],
      type: CannabisStraintype.Indica,
    },
    {
      name: "Super Lemon Haze",
      description:
        "Super Lemon Haze is a sativa-dominant strain that combines Lemon Skunk and Super Silver Haze. It has a zesty lemon aroma with undertones of citrus and earth. The high is uplifting and energetic, providing a burst of creativity and a happy, euphoric feeling.",
      flavors: ["lemon", "citrus", "sweet", "spicy"],
      effects: ["euphoria", "energizing", "happiness", "creativity"],
      type: CannabisStraintype.Sativa,
    },
    {
      name: "Wedding Cake",
      description:
        "Wedding Cake is an indica-dominant hybrid known for its sweet and vanilla-like aroma. It has dense buds covered in a thick layer of trichomes. The high is calming and euphoric, providing a sense of relaxation and happiness.",
      flavors: ["sweet", "vanilla", "earthy", "spicy"],
      effects: ["relaxation", "euphoria", "happiness", "creativity"],
      type: CannabisStraintype.Hybrid,
    },
    {
      name: "Wedding Cake Automatic",
      description:
        "Wedding Cake Automatic, a feminized autoflowering strain from Zamnesia Seeds, is the result of a harmonious genetic blend of Triangle Kush, Animal Mints, and Ruderalis. This indica-dominant hybrid boasts a quick and easy cultivation process, with a robust nature that thrives in various conditions. Expect a height of 120–150cm and a flowering time of 56-63 days. With yields of up to 450–500g/m² indoors and 100–150g/plant outdoors, it delivers a satisfying harvest. Its dense buds emanate sweet and fruity aromas with hints of citrus, vanilla, and wood. With a THC content of around 24%, its high offers a cerebral rush followed by a relaxed state of contentment and tranquility, making it perfect for unwinding alone or with friends.",
      flavors: ["Sweet", "Fruity", "Citrus", "Vanilla", "Woody"],
      effects: ["Cerebral", "Relaxed", "Euphoric", "Content"],
      type: CannabisStraintype.Indica,
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
      effects: ["euphoria", "relaxation", "happiness", "creativity"],
      type: CannabisStraintype.Hybrid,
    },
    {
      name: "Bruce Banner",
      description:
        "Bruce Banner is a potent hybrid strain named after the alter ego of the Hulk. It has a sweet and diesel-like aroma with earthy undertones. The high is characterized by a powerful euphoria and creative energy, gradually transitioning into deep relaxation.",
      flavors: ["sweet", "diesel", "earthy", "spicy"],
      effects: ["euphoria", "energy", "relaxation", "creativity"],
      type: CannabisStraintype.Hybrid,
    },
    {
      name: "Cheese",
      description:
        "Cheese is a hybrid strain known for its pungent aroma and relaxing effects. It has a distinctive cheesy scent with earthy undertones. The high is calming and euphoric, making it a popular choice for relaxation.",
      flavors: ["cheese", "earthy"],
      effects: ["relaxation", "euphoria", "happiness"],
      type: CannabisStraintype.Hybrid,
    },
    {
      name: "Critical+",
      description:
        "Critical+ is an indica-dominant hybrid with a sweet and skunky aroma. It is celebrated for its potent relaxing effects, providing a soothing experience for both the body and mind.",
      flavors: ["sweet", "skunky"],
      effects: ["relaxation", "euphoria", "happiness"],
      type: CannabisStraintype.Indica,
    },
    {
      name: "Do-Si-Dos",
      description:
        "Do-Si-Dos is a potent indica strain with a sweet and earthy flavor profile. It is known for its relaxing and sedative effects, making it an excellent choice for those seeking stress relief and sleep aid.",
      flavors: ["sweet", "earthy"],
      effects: ["relaxation", "sedation", "euphoria"],
      type: CannabisStraintype.Indica,
    },
    {
      name: "Break-up Cake",
      description:
        "Break-up Cake is a hybrid strain that offers a delightful blend of sweet and fruity flavors. It provides a balanced high with euphoric and relaxing effects, making it suitable for various occasions.",
      flavors: ["sweet", "fruity"],
      effects: ["euphoria", "relaxation", "happiness"],
      type: CannabisStraintype.Hybrid,
    },
    {
      name: "Amnesia Haze",
      description:
        "Amnesia Haze is a sativa-dominant strain known for its uplifting and energetic effects. It has a citrusy aroma with hints of earthiness. The high is cerebral and euphoric, promoting creativity and focus.",
      flavors: ["citrus", "earthy"],
      effects: ["euphoria", "energizing", "creativity"],
      type: CannabisStraintype.Sativa,
    },
    {
      name: "Super Silver Haze",
      description:
        "Super Silver Haze is a sativa-dominant strain that combines the genetics of Skunk, Northern Lights, and Haze. It has a skunky and citrusy aroma with a hint of spice. The high is uplifting and cerebral, making it a popular choice for daytime use.",
      flavors: ["skunky", "citrus", "spicy"],
      effects: ["euphoria", "energizing", "happiness", "creativity"],
      type: CannabisStraintype.Sativa,
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

    console.log(`Created Cannabis Strain: ${createdStrain.name}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
