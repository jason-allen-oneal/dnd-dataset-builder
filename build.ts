import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import customBackgrounds from "./backgrounds";
import { uploadFile, createRepo } from "@huggingface/hub";


// Types
type EndpointIndex = {
  index: string;
  name: string;
  url: string;
};

type AlpacaSample = {
  instruction: string;
  input: string;
  output: string;
};

// API Data Types
type AbilityScoreData = {
  name: string;
  full_name: string;
  desc: string[];
  skills: Array<{ name: string }>;
};

type AlignmentData = {
  name: string;
  abbreviation: string;
  desc: string;
};

type BackgroundData = {
  name: string;
  starting_proficiencies: Array<{ name: string }>;
  language_options: { choose: number } | null;
  feature?: { name: string; desc: string[] };
};

type ClassData = {
  name: string;
  hit_die: number;
  proficiency_choices?: Array<{ desc: string }>;
  proficiencies?: Array<{ index: string; name: string }>;
  saving_throws?: Array<{ name: string }>;
  starting_equipment?: any[];
  starting_equipment_options?: any[];
  subclasses?: Array<{ name: string }>;
  spellcasting?: { spellcasting_ability?: { name: string } };
  multi_classing?: { prerequisites?: Array<{ ability_score?: { index: string }; score: number }> };
};

type ConditionData = {
  name: string;
  desc: string[];
};

type DamageTypeData = {
  name: string;
  desc: string[];
};

type EquipmentData = {
  name: string;
  equipment_category?: { name: string };
  cost?: { quantity: number; unit: string };
  weight?: number;
  vehicle_category?: string;
  gear_category?: { name: string };
  tool_category?: string;
  weapon_category?: string;
  damage?: { damage_dice: string; damage_type?: { name: string } };
  range?: { normal: number };
  speed?: { quantity: number; unit: string };
  properties?: Array<{ name: string }>;
  desc?: string[];
  special?: string[];
};

type FeatData = {
  name: string;
  prerequisites?: Array<{ ability_score?: { name?: string; index?: string }; minimum_score: number }>;
  desc?: string[];
};

type FeatureData = {
  name: string;
  level: number;
  class?: { name: string };
  subclass?: { name: string };
  prerequisites?: Array<{ ability_score?: { name: string }; minimum_score: number }>;
  desc?: string[];
};

type LanguageData = {
  name: string;
  type: string;
  typical_speakers?: string[];
  script: string;
  desc?: string;
};

type MagicItemData = {
  name: string;
  equipment_category?: { name: string };
  rarity?: { name: string };
  desc?: string[];
};

// Builder Functions
function buildAbilityScore(data: AbilityScoreData) {
  const instruction = `What is the ability score "${data.full_name}" in D&D 5e?`;
  const desc = data.desc.join(" ");
  const output = `${data.full_name} (${data.name})\n${desc}`;
  return { instruction, output };
}

function buildAlignment(data: AlignmentData) {
  const instruction = `What is the alignment "${data.name}" in D&D 5e?`;
  const output = `${data.name} (${data.abbreviation})\n${data.desc}`;
  return { instruction, output };
}

function buildBackground(data: BackgroundData) {
  const instruction = `Describe the ${data.name} background in D&D 5e.`;
  const profs = data.starting_proficiencies
    .map((p) => p.name.replace("Skill: ", ""))
    .join(", ");
  const languages = data.language_options 
    ? `You can choose ${data.language_options.choose} additional languages.`
    : "No additional languages.";
  const featureName = data.feature?.name || "";
  const featureDesc = data.feature?.desc?.join(" ") || "";
  const traits = `This background provides personality traits, ideals, bonds, and flaws to help define your character's story.`;
  const equipment = `This background includes some starting equipment.`;
  const output = `${data.name} grants proficiency in: ${profs}. ${languages} ${equipment} Feature: ${featureName} — ${featureDesc} ${traits}`;
  return { instruction, output };
}

function buildClass(data: ClassData) {
  const instruction = `Describe the ${data.name} class in D&D 5e.`;
  
  const hitDie = data.hit_die;
  const profChoiceDesc = data.proficiency_choices?.map((choice) => choice.desc).join("; ") || "";
  const fixedProfs = data.proficiencies?.filter((p) => !p.index.startsWith("saving-throw")).map((p) => p.name).join(", ");
  const savingThrows = data.saving_throws?.map((st) => st.name).join(", ");
  const equipmentCount = data.starting_equipment?.length || 0;
  const equipmentOptionsCount = data.starting_equipment_options?.length || 0;
  const equipmentSummary = `Starting equipment includes ${equipmentCount} fixed items and ${equipmentOptionsCount} choice sets.`;
  const subclasses = data.subclasses?.map((sc) => sc.name).join(", ");
  
  let spellcastingSummary = "";
  if (data.spellcasting) {
    const ability = data.spellcasting.spellcasting_ability?.name || "";
    spellcastingSummary = `This class uses ${ability} for spellcasting.`;
  }
  
  let multiclassSummary = "";
  if (data.multi_classing?.prerequisites?.length) {
    const prereqs = data.multi_classing.prerequisites
      .map((req) => req.ability_score ? `${req.ability_score.index.toUpperCase()} ≥ ${req.score}` : "")
      .filter(Boolean)
      .join(" and ");
    if (prereqs) {
      multiclassSummary = `Multi-classing requires: ${prereqs}.`;
    }
  }
  
  const outputParts = [
    `${data.name} has a hit die of d${hitDie}.`,
    profChoiceDesc ? `Proficiency choices: ${profChoiceDesc}.` : "",
    fixedProfs ? `Fixed proficiencies include: ${fixedProfs}.` : "",
    savingThrows ? `Saving throws are: ${savingThrows}.` : "",
    equipmentSummary,
    subclasses ? `Available subclasses: ${subclasses}.` : "",
    spellcastingSummary,
    multiclassSummary,
  ].filter(Boolean);
  
  const output = outputParts.join(" ");
  return { instruction, output };
}

function buildCondition(data: ConditionData) {
  const instruction = `Describe the ${data.name} condition in D&D 5e.`;
  const desc = data.desc.join(" ");
  const output = `${data.name}\n${desc}`;
  return { instruction, output };
}

function buildDamageType(data: DamageTypeData) {
  const instruction = `Describe the ${data.name} damage type in D&D 5e.`;
  const desc = data.desc.join(" ");
  const output = `${data.name}\n${desc}`;
  return { instruction, output };
}

function buildEquipment(data: EquipmentData) {
  const instruction = `Describe the ${data.name} equipment in D&D 5e.`;
  
  const category = data.equipment_category?.name || "Equipment";
  const cost = data.cost ? `${data.cost.quantity} ${data.cost.unit}` : "Unknown";
  const weight = data.weight !== undefined ? `${data.weight} lb` : null;
  const vehicleCategory = data.vehicle_category ? ` This is a ${data.vehicle_category}.` : "";
  const gearCategory = data.gear_category?.name ? ` This belongs to the ${data.gear_category.name} category.` : "";
  const toolCategory = data.tool_category ? ` This is a type of ${data.tool_category}.` : "";
  const weaponCategory = data.weapon_category ? ` Weapon type: ${data.weapon_category}.` : "";
  const damage = data.damage ? ` It deals ${data.damage.damage_dice} ${data.damage.damage_type?.name} damage.` : "";
  const range = data.range?.normal ? ` Range: ${data.range.normal} ft.` : "";
  const speed = data.speed ? ` Speed: ${data.speed.quantity} ${data.speed.unit}.` : "";
  const properties = data.properties?.length ? ` Properties: ${data.properties.map((p) => p.name).join(", ")}.` : "";
  const desc = data.desc?.length ? ` ${data.desc.join(" ")}` : "";
  const special = data.special?.length ? ` Special: ${data.special.join(" ")}` : "";
  
  const output = `${data.name} is part of ${category}.${vehicleCategory}${gearCategory}${toolCategory}${weaponCategory} It costs ${cost}.${weight ? ` Weight: ${weight}.` : ""}${speed}${damage}${range}${properties}${desc}${special}`;
  return { instruction, output };
}

function buildFeat(data: FeatData) {
  const instruction = `Describe the ${data.name} feat in D&D 5e.`;
  const prerequisites = data.prerequisites?.length
    ? data.prerequisites
        .map((p) => `${p.ability_score?.name || p.ability_score?.index?.toUpperCase() || "Ability"} ≥ ${p.minimum_score}`)
        .join(", ")
    : "";
  const prereqText = prerequisites ? `Prerequisite: ${prerequisites}.` : "";
  const description = data.desc?.join(" ") || "";
  const output = `${data.name} feat. ${prereqText} ${description}`.trim();
  return { instruction, output };
}

function buildFeature(data: FeatureData) {
  const instruction = `Describe the ${data.name} feature in D&D 5e.`;
  const prereqs = data.prerequisites?.length
    ? data.prerequisites
        .map((p) => p.ability_score ? `${p.ability_score.name} ≥ ${p.minimum_score}` : `Prerequisite`)
        .join(", ")
    : "";
  const prereqText = prereqs ? `Prerequisite: ${prereqs}. ` : "";
  const subclassText = data.subclass?.name ? ` (${data.subclass.name} subclass)` : "";
  const descText = data.desc?.join(" ") || "";
  const output = `${data.name}${subclassText} (Level ${data.level}) for ${data.class?.name || ""}. ${prereqText}${descText}`.trim();
  return { instruction, output };
}

function buildLanguage(data: LanguageData) {
  const instruction = `Describe the ${data.name} language in D&D 5e.`;
  const speakers = data.typical_speakers?.join(", ") || "None";
  const desc = data.desc || "";
  const output = `${data.name} is a ${data.type} language. Typical speakers: ${speakers}. Script: ${data.script}. ${desc}`.trim();
  return { instruction, output };
}

function buildMagicItem(data: MagicItemData) {
  const instruction = `Describe the ${data.name} magic item in D&D 5e.`;
  const category = data.equipment_category?.name || "Magic Item";
  const rarity = data.rarity?.name || "Unknown rarity";
  const desc = data.desc?.join(" ") || "";
  const output = `${data.name} is a ${rarity} ${category}. ${desc}`.trim();
  return { instruction, output };
}

function buildMagicSchool(data: any) {
    const instruction = `Describe the ${data.name} magic school in D&D 5e.`;
    const desc = data.desc;
    const output = `${data.name}\n${desc}`.trim();
    return { instruction, output };
}

function buildMonster(data: any) {
    const name = data.name;
    const instruction = `Describe the ${name} monster in D&D 5e.`;

  // Basic traits
  const size = data.size || "Unknown size";
  const type = data.type || "creature";
  const alignment = data.alignment || "unaligned";

  const ac = Array.isArray(data.armor_class)
    ? data.armor_class.map((ac: any) => `${ac.value} (${ac.type})`).join(", ")
    : String(data.armor_class || "unknown");

  const hp = data.hit_points || "unknown HP";
  const hd = data.hit_dice || "";

  const speed = data.speed
    ? Object.entries(data.speed)
        .map(([k, v]) => `${k} ${v}`)
        .join(", ")
    : "unknown speed";

  const abilities = `STR ${data.strength} DEX ${data.dexterity} CON ${data.constitution} INT ${data.intelligence} WIS ${data.wisdom} CHA ${data.charisma}`;

  const senses = data.senses
    ? Object.entries(data.senses)
        .map(([k, v]) => `${k} ${v}`)
        .join(", ")
    : "none";

  const languages = data.languages || "None";
  const cr = data.challenge_rating ?? "?";

  const desc = data.desc ? `${data.desc} ` : "";

  const specialAbilities = (data.special_abilities || [])
    .map((sa: any) => `**${sa.name}:** ${sa.desc}`)
    .join("\n\n");

  const actions = (data.actions || [])
    .map((a: any) => `**${a.name}:** ${a.desc}`)
    .join("\n\n");

  const output = `${name} is a ${size} ${type} (${alignment}).
AC: ${ac}, HP: ${hp} (${hd}), Speed: ${speed}.
Abilities: ${abilities}.
Senses: ${senses}. Languages: ${languages}. CR: ${cr}.

${desc}${specialAbilities ? `Special Abilities:\n${specialAbilities}\n` : ""}${actions ? `Actions:\n${actions}` : ""}`.trim();

  return { instruction, output };
}

function buildProficiency(data: any) {
    const instruction = `Describe the ${data.name} proficiency in D&D 5e.`;
    const name = data.name;
  const type = data.type || "Proficiency";
  const classes = Array.isArray(data.classes) && data.classes.length
    ? data.classes.map((c: any) => c.name).join(", ")
    : "any class";
  const races = Array.isArray(data.races) && data.races.length
    ? data.races.map((r: any) => r.name).join(", ")
    : "any race";

  const output = `${name} is a ${type.toLowerCase()} proficiency. It is available to ${classes} and ${races}.`;
    return { instruction, output };
}

function buildRace(data: any) {
    let abilityBonuses = "None";
  if (data.ability_bonuses && data.ability_bonuses.length > 0) {
    abilityBonuses = data.ability_bonuses
      .map((b: any) => {
        const abilityName = b.ability_score && b.ability_score.name
          ? b.ability_score.name
          : b.ability_score || "Unknown";
        return `+${b.bonus} ${abilityName}`;
      })
      .join(", ");
  }

  // Format languages
  let languages = "None";
  if (data.languages && data.languages.length > 0) {
    languages = data.languages.map((l: any) => l.name || l).join(", ");
  }

  // Format traits
  let traits = "None";
  if (data.traits && data.traits.length > 0) {
    traits = data.traits.map((t: any) => t.name || t).join(", ");
  }

  // Format subraces
  let subraces = "None";
  if (data.subraces && data.subraces.length > 0) {
    subraces = data.subraces.map((s: any) => s.name || s).join(", ");
  }

  // Compose the instruction
  const instruction = "Summarize the D&D 5e race traits, abilities, and details.";

  // Prepare input JSON with simplified structure
  const input = {
    index: data.index,
    name: data.name,
    speed: data.speed,
    ability_bonuses: (data.ability_bonuses || []).map((b: any) => ({
      ability_score: (b.ability_score && b.ability_score.name) || b.ability_score || "Unknown",
      bonus: b.bonus
    })),
    age: data.age || "",
    alignment: data.alignment || "",
    size: data.size || "",
    size_description: data.size_description || "",
    starting_proficiencies: data.starting_proficiencies || [],
    languages: (data.languages || []).map((l: any) => ({ index: l.index, name: l.name })),
    language_desc: data.language_desc || "",
    traits: (data.traits || []).map((t: any) => ({ index: t.index, name: t.name })),
    subraces: (data.subraces || []).map((s: any) => ({ index: s.index, name: s.name }))
  };

  // Compose the response summary
  let response = `${data.name}s are ${data.size} humanoids with a speed of ${data.speed} feet. They have ability bonuses of ${abilityBonuses}. `;

  if (data.age) {
    response += `They ${data.age.toLowerCase()} `;
  }
  if (data.alignment) {
    response += `${data.alignment} `;
  }

  response += `They speak ${languages}. `;

  if (traits !== "None") {
    response += `Traits include: ${traits}. `;
  }
  if (subraces !== "None") {
    response += `Subraces include: ${subraces}.`;
  }

  return { instruction, output: response };
}

function buildRuleSection(data: any) {
  const instruction = `Describe the ${data.name} rule in D&D 5e.`;
  const name = data.name;
  const desc = data.desc || "";
  
  // Clean up the description by removing markdown formatting
  const cleanDesc = desc
    .replace(/^## .*\n/, '') // Remove the title header
    .replace(/\n\n/g, ' ') // Replace double newlines with spaces
    .replace(/\n/g, ' ') // Replace single newlines with spaces
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
    .replace(/\*(.*?)\*/g, '$1') // Remove italic formatting
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  const output = `${name}: ${cleanDesc}`;
  return { instruction, output };
}

function buildRule(data: any) {
  const instruction = `Describe the ${data.name} rule in D&D 5e.`;
  const name = data.name;
  const desc = data.desc || "";
  
  // Clean up the description by removing markdown formatting
  const cleanDesc = desc
    .replace(/^# .*\n/, '') // Remove the title header
    .replace(/\n\n/g, ' ') // Replace double newlines with spaces
    .replace(/\n/g, ' ') // Replace single newlines with spaces
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
    .replace(/\*(.*?)\*/g, '$1') // Remove italic formatting
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  // Add subsections if they exist
  const subsections = data.subsections?.length 
    ? ` Subsections include: ${data.subsections.map((s: any) => s.name).join(', ')}.`
    : '';
  
  const output = `${name}: ${cleanDesc}${subsections}`;
  return { instruction, output };
}

function buildSkill(data: any) {
  const instruction = `Describe the ${data.name} skill in D&D 5e.`;
  const name = data.name;
  const desc = Array.isArray(data.desc) ? data.desc.join(' ') : data.desc || "";
  const abilityScore = data.ability_score?.name || "Unknown";
  
  const output = `${name} is a ${abilityScore} skill. ${desc}`;
  return { instruction, output };
}

function buildSpell(data: any) {
  const instruction = `Describe the ${data.name} spell in D&D 5e.`;
  const name = data.name;
  const level = data.level;
  const school = data.school?.name || "Unknown school";
  const desc = Array.isArray(data.desc) ? data.desc.join(' ') : data.desc || "";
  const castingTime = data.casting_time || "Unknown";
  const range = data.range || "Unknown";
  const duration = data.duration || "Unknown";
  const components = Array.isArray(data.components) ? data.components.join(', ') : data.components || "";
  const concentration = data.concentration ? "Requires concentration" : "No concentration required";
  const ritual = data.ritual ? "Can be cast as a ritual" : "";
  
  const classes = data.classes?.length 
    ? data.classes.map((c: any) => c.name).join(', ')
    : "No classes";
  
  const subclasses = data.subclasses?.length 
    ? data.subclasses.map((s: any) => s.name).join(', ')
    : "";
  
  const levelText = level === 0 ? "Cantrip" : `${level}${getOrdinalSuffix(level)} level`;
  
  const output = `${name} is a ${levelText} ${school} spell. Casting time: ${castingTime}. Range: ${range}. Duration: ${duration}. Components: ${components}. ${concentration}. ${ritual} Available to: ${classes}. ${subclasses ? `Subclasses: ${subclasses}. ` : ""}${desc}`;
  
  return { instruction, output };
}

function getOrdinalSuffix(num: number): string {
  if (num >= 11 && num <= 13) return 'th';
  switch (num % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

function buildSubclass(data: any) {
  const instruction = `Describe the ${data.name} subclass in D&D 5e.`;
  const name = data.name;
  const className = data.class?.name || "Unknown class";
  const flavor = data.subclass_flavor || "Subclass";
  const desc = Array.isArray(data.desc) ? data.desc.join(' ') : data.desc || "";
  const spellCount = data.spells?.length || 0;
  
  const spellInfo = spellCount > 0 ? ` This subclass grants ${spellCount} additional spells.` : "";
  
  const output = `${name} is a ${flavor} for the ${className} class.${spellInfo} ${desc}`;
  return { instruction, output };
}

function buildSubrace(data: any) {
  const instruction = `Describe the ${data.name} subrace in D&D 5e.`;
  const name = data.name;
  const raceName = data.race?.name || "Unknown race";
  const desc = data.desc || "";
  
  // Format ability bonuses
  let abilityBonuses = "None";
  if (data.ability_bonuses && data.ability_bonuses.length > 0) {
    abilityBonuses = data.ability_bonuses
      .map((b: any) => {
        const abilityName = b.ability_score?.name || b.ability_score || "Unknown";
        return `+${b.bonus} ${abilityName}`;
      })
      .join(", ");
  }
  
  // Format starting proficiencies
  const proficiencies = data.starting_proficiencies?.length 
    ? data.starting_proficiencies.map((p: any) => p.name).join(", ")
    : "None";
  
  // Format racial traits
  const traits = data.racial_traits?.length 
    ? data.racial_traits.map((t: any) => t.name).join(", ")
    : "None";
  
  const output = `${name} is a subrace of ${raceName}. Ability bonuses: ${abilityBonuses}. Starting proficiencies: ${proficiencies}. Racial traits: ${traits}. ${desc}`;
  return { instruction, output };
}

function buildTrait(data: any) {
  const instruction = `Describe the ${data.name} trait in D&D 5e.`;
  const name = data.name;
  const desc = Array.isArray(data.desc) ? data.desc.join(' ') : data.desc || "";
  
  // Format races that have this trait
  const races = data.races?.length 
    ? data.races.map((r: any) => r.name).join(", ")
    : "None";
  
  // Format subraces that have this trait
  const subraces = data.subraces?.length 
    ? data.subraces.map((s: any) => s.name).join(", ")
    : "None";
  
  // Format proficiencies granted
  const proficiencies = data.proficiencies?.length 
    ? data.proficiencies.map((p: any) => p.name).join(", ")
    : "None";
  
  const output = `${name} is a racial trait. Available to races: ${races}. Available to subraces: ${subraces}. Grants proficiencies: ${proficiencies}. ${desc}`;
  return { instruction, output };
}

function buildWeaponProperty(data: any) {
  const instruction = `Describe the ${data.name} weapon property in D&D 5e.`;
  const name = data.name;
  const desc = Array.isArray(data.desc) ? data.desc.join(' ') : data.desc || "";
  
  const output = `${name} is a weapon property. ${desc}`;
  return { instruction, output };
}

// Main Functions
const BASE_URL = "https://www.dnd5eapi.co";

async function getRootEndpoints(): Promise<Record<string, string>> {
  const res = await fetch(`${BASE_URL}/api`);
  if (!res.ok) throw new Error(`Failed to get endpoints: ${res.statusText}`);
  return res.json() as Promise<Record<string, string>>;
}

async function fetchEndpointData(url: string): Promise<any> {
  const res = await fetch(`${BASE_URL}${url}`);
  if (!res.ok) throw new Error(`Failed to fetch ${BASE_URL}${url}: ${res.statusText}`);
  return res.json();
}

async function buildDataset(): Promise<AlpacaSample[]> {
  const endpoints = await getRootEndpoints();
  const dataset: AlpacaSample[] = [];

  // Process API data
  for (const [key, path] of Object.entries(endpoints)) {
    const entries = await fetchEndpointData(path) as { results: EndpointIndex[] };
    
    for (const entry of entries.results) {
      const data = await fetchEndpointData(entry.url);
      
      let instruction = "";
      let output = "";
      
      switch (key) {
        case "ability-scores":
          ({ instruction, output } = buildAbilityScore(data));
          break;
        case "alignments":
          ({ instruction, output } = buildAlignment(data));
          break;
        case "backgrounds":
          ({ instruction, output } = buildBackground(data));
          break;
        case "classes":
          ({ instruction, output } = buildClass(data));
          break;
        case "conditions":
          ({ instruction, output } = buildCondition(data));
          break;
        case "damage-types":
          ({ instruction, output } = buildDamageType(data));
          break;
        case "equipment":
          ({ instruction, output } = buildEquipment(data));
          break;
        case "feats":
          ({ instruction, output } = buildFeat(data));
          break;
        case "features":
          ({ instruction, output } = buildFeature(data));
          break;
        case "languages":
          ({ instruction, output } = buildLanguage(data));
          break;
        case "magic-items":
          ({ instruction, output } = buildMagicItem(data));
          break;
        case "magic-schools":
          ({ instruction, output } = buildMagicSchool(data));
          break;

        case "monsters":
            ({ instruction, output } = buildMonster(data));
        break;
        case "proficiencies":
            ({ instruction, output } = buildProficiency(data));
        break;
        case "races":
            ({ instruction, output } = buildRace(data));
        break;
        case "rule-sections":
            ({ instruction, output } = buildRuleSection(data));
        break;
        case "rules":
            ({ instruction, output } = buildRule(data));
        break;
        case "skills":
            ({ instruction, output } = buildSkill(data));
        break;
        case "spells":
            ({ instruction, output } = buildSpell(data));
        break;
        case "subclasses":
            ({ instruction, output } = buildSubclass(data));
        break;
        case "subraces":
            ({ instruction, output } = buildSubrace(data));
        break;
        case "traits":
            ({ instruction, output } = buildTrait(data));
        break;
        case "weapon-properties":
            ({ instruction, output } = buildWeaponProperty(data));
            break;
      }
      
      if (instruction && output) {
        dataset.push({ instruction, input: "", output });
      }
    }
  }

  // Add custom backgrounds to the dataset
  for (const background of customBackgrounds) {
    const { instruction, output } = buildBackground(background);
    if (instruction && output) {
      dataset.push({ instruction, input: "", output });
    }
  }
  
  return dataset;
}

async function writeDatasetToFile(dataset: AlpacaSample[], filename: string = "5e_alpaca_dataset.jsonl"): Promise<void> {
  const outputPath = path.join(process.cwd(), "data", filename);
  const fileStream = fs.createWriteStream(outputPath, { flags: "w" });
  
  for (const entry of dataset) {
    fileStream.write(JSON.stringify(entry) + "\n");
  }
  
  fileStream.end();
  console.log(`✅ Wrote ${dataset.length} samples to ${outputPath}`);
}

async function uploadDatasetToHuggingFace(
  dataset: AlpacaSample[],
  repoName: string,
  token: string
): Promise<void> {
  try {
    console.log("📤 Uploading dataset to Hugging Face...");

    // Ensure repoName is in the correct format for datasets
    const datasetRepoName = repoName.startsWith("datasets/") ? repoName : `datasets/${repoName}`;
    
    console.log(`📋 Using repository: ${datasetRepoName}`);

    // Create dataset content
    const datasetContent = dataset.map(entry => JSON.stringify(entry)).join("\n");

    // Create README content
    const readmeContent = `# D&D 5e Alpaca Dataset

A comprehensive dataset of Dungeons & Dragons 5th Edition content formatted for instruction-following language model training.

## Dataset Information

- **Size**: ${dataset.length} samples
- **Format**: Alpaca instruction-following format
- **License**: MIT
- **Source**: D&D 5e SRD API + custom content

## Content Categories

The dataset includes information about:

- Ability scores and their descriptions
- Character alignments
- Backgrounds and their features
- Character classes and their mechanics
- Conditions and their effects
- Damage types
- Equipment, weapons, and armor
- Feats and features
- Languages
- Magic items and schools
- Monsters and their stats
- Proficiencies
- Races and subraces
- Rules and rule sections
- Skills
- Spells and their descriptions
- Subclasses
- Traits
- Weapon properties

## Usage

This dataset is perfect for fine-tuning language models to understand and respond to D&D 5e related queries. Each sample follows the Alpaca format:

\`\`\`json
{
  "instruction": "What is the ability score \\"Charisma\\" in D&D 5e?",
  "input": "",
  "output": "Charisma (CHA)\\nCharisma measures your ability to interact effectively with others..."
}
\`\`\`

## License

This dataset is licensed under the MIT License. The underlying D&D 5e content is subject to Wizards of the Coast's Open Game License.

## Citation

If you use this dataset in your research or projects, please cite:

\`\`\`
@dataset{dnd_5e_alpaca_dataset,
  title={D&D 5e Alpaca Dataset},
  author={Your Name},
  year={2024},
  url={https://huggingface.co/datasets/${repoName}}
}
\`\`\`
`;

    // Try to create the repository first (it's okay if it already exists)
    try {
      console.log("📋 Creating repository...");
      await createRepo({
        repo: datasetRepoName,
        accessToken: token
      });
      console.log("✅ Repository created successfully!");
    } catch (error: any) {
      if (error.statusCode === 409) {
        console.log("ℹ️ Repository already exists, continuing...");
      } else {
        console.log("⚠️ Could not create repository, attempting to upload anyway...");
      }
    }

    // Upload dataset file
    console.log("📤 Uploading dataset file...");
    const datasetBlob = new Blob([datasetContent], { type: "application/json" });
    const datasetFile = new File([datasetBlob], "5e_alpaca_dataset.jsonl", { type: "application/json" });
    
    await uploadFile({
      repo: datasetRepoName,
      file: datasetFile,
      commitTitle: "Add D&D 5e Alpaca dataset",
      accessToken: token
    });

    // Upload README
    console.log("📤 Uploading README...");
    const readmeBlob = new Blob([readmeContent], { type: "text/markdown" });
    const readmeFile = new File([readmeBlob], "README.md", { type: "text/markdown" });
    
    await uploadFile({
      repo: datasetRepoName,
      file: readmeFile,
      commitTitle: "Add dataset documentation",
      accessToken: token
    });

    console.log("✅ Dataset uploaded successfully!");
    console.log(`🔗 View your dataset at: https://huggingface.co/datasets/${repoName}`);

  } catch (error) {
    console.error("❌ Error uploading dataset:", error);
    throw error;
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const shouldUpload = args.includes("--upload");
  const repoName = args.find(arg => arg.startsWith("--repo="))?.split("=")[1];
  const token = args.find(arg => arg.startsWith("--token="))?.split("=")[1];

  try {
    const dataset = await buildDataset();
    console.log(`Generated ${dataset.length} samples`);
    await writeDatasetToFile(dataset);
    
    if (shouldUpload) {
      if (!repoName || !token) {
        console.log("");
        console.log("📋 To upload to Hugging Face, use:");
        console.log("   npm run build-dataset -- --upload --repo=yourusername/dataset-name --token=your-hf-token");
        console.log("");
        console.log("   Or run without upload to prepare files manually:");
        console.log("   npm run build-dataset -- --upload --repo=yourusername/dataset-name");
        return;
      }
      
      await uploadDatasetToHuggingFace(dataset, repoName, token);
    }
    
  } catch (error) {
    console.error("Error building dataset:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { buildDataset, writeDatasetToFile, uploadDatasetToHuggingFace, type AlpacaSample };
