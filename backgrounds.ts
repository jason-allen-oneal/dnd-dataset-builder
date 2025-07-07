export default [
    {
        "index": "charlatan",
        "name": "Charlatan",
        "starting_proficiencies": [
        { "index": "skill-deception", "name": "Skill: Deception", "url": "/api/2014/proficiencies/skill-deception" },
        { "index": "skill-sleight-of-hand", "name": "Skill: Sleight of Hand", "url": "/api/2014/proficiencies/skill-sleight-of-hand" }
        ],
        "language_options": null,
        "starting_equipment": [
        { "equipment": "[Object]", "quantity": 1 },
        { "equipment": "[Object]", "quantity": 1 }
        ],
        "starting_equipment_options": [ { "choose": 1, "type": "equipment", "from": "[Object]" } ],
        "feature": {
        "name": "False Identity",
        "desc": [
            "You have created a second identity that includes documentation, established acquaintances, and disguises that allow you to assume that persona. Additionally, you can forge documents including official papers and personal letters, as long as you have seen an example of the kind of document or the handwriting you are trying to copy."
        ]
        },
        "personality_traits": {
        "choose": 2,
        "type": "personality_traits",
        "from": { "option_set_type": "options_array", "options": "[Array]" }
        },
        "ideals": { "choose": 1, "type": "ideals", "from": { "option_set_type": "options_array", "options": "[Array]" } },
        "bonds": { "choose": 1, "type": "bonds", "from": { "option_set_type": "options_array", "options": "[Array]" } },
        "flaws": { "choose": 1, "type": "flaws", "from": { "option_set_type": "options_array", "options": "[Array]" } },
        "url": "/api/2014/backgrounds/charlatan",
        "updated_at": "2025-04-08T21:13:55.880Z"
    },
    {
        "index": "criminal",
        "name": "Criminal",
        "starting_proficiencies": [
          { "index": "skill-deception", "name": "Skill: Deception", "url": "/api/2014/proficiencies/skill-deception" },
          { "index": "skill-stealth", "name": "Skill: Stealth", "url": "/api/2014/proficiencies/skill-stealth" }
        ],
        "language_options": null,
        "starting_equipment": [
          { "equipment": "[Object]", "quantity": 1 },
          { "equipment": "[Object]", "quantity": 1 }
        ],
        "starting_equipment_options": [ { "choose": 1, "type": "equipment", "from": "[Object]" } ],
        "feature": {
          "name": "Criminal Contact",
          "desc": [
            "You have a reliable and trustworthy contact who acts as your liaison to a network of other criminals. You know how to get messages to and from your contact, even over great distances; specifically, you know the local messengers, corrupt caravan masters, and seedy sailors who can deliver messages for you."
          ]
        },
        "personality_traits": {
          "choose": 2,
          "type": "personality_traits",
          "from": { "option_set_type": "options_array", "options": "[Array]" }
        },
        "ideals": { "choose": 1, "type": "ideals", "from": { "option_set_type": "options_array", "options": "[Array]" } },
        "bonds": { "choose": 1, "type": "bonds", "from": { "option_set_type": "options_array", "options": "[Array]" } },
        "flaws": { "choose": 1, "type": "flaws", "from": { "option_set_type": "options_array", "options": "[Array]" } },
        "url": "/api/2014/backgrounds/criminal",
        "updated_at": "2025-04-08T21:13:55.880Z"
      },
      {
        "index": "folk-hero",
        "name": "Folk Hero",
        "starting_proficiencies": [
          { "index": "skill-animal-handling", "name": "Skill: Animal Handling", "url": "/api/2014/proficiencies/skill-animal-handling" },
          { "index": "skill-survival", "name": "Skill: Survival", "url": "/api/2014/proficiencies/skill-survival" }
        ],
        "language_options": null,
        "starting_equipment": [
          { "equipment": "[Object]", "quantity": 1 },
          { "equipment": "[Object]", "quantity": 1 }
        ],
        "starting_equipment_options": [ { "choose": 1, "type": "equipment", "from": "[Object]" } ],
        "feature": {
          "name": "Rustic Hospitality",
          "desc": [
            "Since you come from the ranks of the common folk, you fit in among them with ease. You can find a place to hide, rest, or recuperate among other commoners, unless you have shown yourself to be a danger to them. They will shield you from the law or anyone else searching for you, though they will not risk their lives for you."
          ]
        },
        "personality_traits": {
          "choose": 2,
          "type": "personality_traits",
          "from": { "option_set_type": "options_array", "options": "[Array]" }
        },
        "ideals": { "choose": 1, "type": "ideals", "from": { "option_set_type": "options_array", "options": "[Array]" } },
        "bonds": { "choose": 1, "type": "bonds", "from": { "option_set_type": "options_array", "options": "[Array]" } },
        "flaws": { "choose": 1, "type": "flaws", "from": { "option_set_type": "options_array", "options": "[Array]" } },
        "url": "/api/2014/backgrounds/folk-hero",
        "updated_at": "2025-04-08T21:13:55.880Z"
      },
      {
        "index": "noble",
        "name": "Noble",
        "starting_proficiencies": [
          { "index": "skill-history", "name": "Skill: History", "url": "/api/2014/proficiencies/skill-history" },
          { "index": "skill-persuasion", "name": "Skill: Persuasion", "url": "/api/2014/proficiencies/skill-persuasion" }
        ],
        "language_options": {
          "choose": 1,
          "type": "languages",
          "from": {
            "option_set_type": "resource_list",
            "resource_list_url": "/api/2014/languages"
          }
        },
        "starting_equipment": [
          { "equipment": "[Object]", "quantity": 1 },
          { "equipment": "[Object]", "quantity": 1 }
        ],
        "starting_equipment_options": [ { "choose": 1, "type": "equipment", "from": "[Object]" } ],
        "feature": {
          "name": "Position of Privilege",
          "desc": [
            "Thanks to your noble birth, people are inclined to think the best of you. You are welcome in high society, and people assume you have the right to be wherever you are. The common folk make every effort to accommodate you and avoid your displeasure, and other people of high birth treat you as a member of the same social sphere."
          ]
        },
        "personality_traits": {
          "choose": 2,
          "type": "personality_traits",
          "from": { "option_set_type": "options_array", "options": "[Array]" }
        },
        "ideals": { "choose": 1, "type": "ideals", "from": { "option_set_type": "options_array", "options": "[Array]" } },
        "bonds": { "choose": 1, "type": "bonds", "from": { "option_set_type": "options_array", "options": "[Array]" } },
        "flaws": { "choose": 1, "type": "flaws", "from": { "option_set_type": "options_array", "options": "[Array]" } },
        "url": "/api/2014/backgrounds/noble",
        "updated_at": "2025-04-08T21:13:55.880Z"
      },
      {
        "index": "outlander",
        "name": "Outlander",
        "starting_proficiencies": [
          { "index": "skill-athletics", "name": "Skill: Athletics", "url": "/api/2014/proficiencies/skill-athletics" },
          { "index": "skill-survival", "name": "Skill: Survival", "url": "/api/2014/proficiencies/skill-survival" }
        ],
        "language_options": {
          "choose": 1,
          "type": "languages",
          "from": {
            "option_set_type": "resource_list",
            "resource_list_url": "/api/2014/languages"
          }
        },
        "starting_equipment": [
          { "equipment": "[Object]", "quantity": 1 },
          { "equipment": "[Object]", "quantity": 1 }
        ],
        "starting_equipment_options": [ { "choose": 1, "type": "equipment", "from": "[Object]" } ],
        "feature": {
          "name": "Wanderer",
          "desc": [
            "You have an excellent memory for maps and geography, and you can always recall the general layout of terrain, settlements, and other features around you. In addition, you can find food and fresh water for yourself and up to five other people each day, provided that the land offers berries, small game, water, and so forth."
          ]
        },
        "personality_traits": {
          "choose": 2,
          "type": "personality_traits",
          "from": { "option_set_type": "options_array", "options": "[Array]" }
        },
        "ideals": { "choose": 1, "type": "ideals", "from": { "option_set_type": "options_array", "options": "[Array]" } },
        "bonds": { "choose": 1, "type": "bonds", "from": { "option_set_type": "options_array", "options": "[Array]" } },
        "flaws": { "choose": 1, "type": "flaws", "from": { "option_set_type": "options_array", "options": "[Array]" } },
        "url": "/api/2014/backgrounds/outlander",
        "updated_at": "2025-04-08T21:13:55.880Z"
      },
      {
        "index": "sage",
        "name": "Sage",
        "starting_proficiencies": [
          { "index": "skill-arcana", "name": "Skill: Arcana", "url": "/api/2014/proficiencies/skill-arcana" },
          { "index": "skill-history", "name": "Skill: History", "url": "/api/2014/proficiencies/skill-history" }
        ],
        "language_options": {
          "choose": 2,
          "type": "languages",
          "from": {
            "option_set_type": "resource_list",
            "resource_list_url": "/api/2014/languages"
          }
        },
        "starting_equipment": [
          { "equipment": "[Object]", "quantity": 1 },
          { "equipment": "[Object]", "quantity": 1 }
        ],
        "starting_equipment_options": [
          { "choose": 1, "type": "equipment", "from": "[Object]" }
        ],
        "feature": {
          "name": "Researcher",
          "desc": [
            "When you attempt to learn or recall a piece of lore, if you do not know that information, you often know where and from whom you can obtain it. Usually, this information comes from a library, scriptorium, university, or a sage or other learned person or creature. Knowing where the information can be found does not automatically give you access to it; permission to enter a library might be needed first, for example."
          ]
        },
        "personality_traits": {
          "choose": 2,
          "type": "personality_traits",
          "from": { "option_set_type": "options_array", "options": "[Array]" }
        },
        "ideals": { "choose": 1, "type": "ideals", "from": { "option_set_type": "options_array", "options": "[Array]" } },
        "bonds": { "choose": 1, "type": "bonds", "from": { "option_set_type": "options_array", "options": "[Array]" } },
        "flaws": { "choose": 1, "type": "flaws", "from": { "option_set_type": "options_array", "options": "[Array]" } },
        "url": "/api/2014/backgrounds/sage",
        "updated_at": "2025-04-08T21:13:55.880Z"
      },
      {
        "index": "soldier",
        "name": "Soldier",
        "starting_proficiencies": [
          { "index": "skill-athletics", "name": "Skill: Athletics", "url": "/api/2014/proficiencies/skill-athletics" },
          { "index": "skill-intimidation", "name": "Skill: Intimidation", "url": "/api/2014/proficiencies/skill-intimidation" }
        ],
        "language_options": null,
        "starting_equipment": [
          { "equipment": "[Object]", "quantity": 1 },
          { "equipment": "[Object]", "quantity": 1 }
        ],
        "starting_equipment_options": [
          { "choose": 1, "type": "equipment", "from": "[Object]" }
        ],
        "feature": {
          "name": "Military Rank",
          "desc": [
            "You have a military rank from your career as a soldier. Soldiers loyal to your former military organization still recognize your authority and influence, and they defer to you if they are of a lower rank. You can invoke your rank to exert influence over other soldiers and requisition simple equipment or horses for temporary use. You can also gain access to friendly military encampments and fortresses where your rank is recognized."
          ]
        },
        "personality_traits": {
          "choose": 2,
          "type": "personality_traits",
          "from": { "option_set_type": "options_array", "options": "[Array]" }
        },
        "ideals": { "choose": 1, "type": "ideals", "from": { "option_set_type": "options_array", "options": "[Array]" } },
        "bonds": { "choose": 1, "type": "bonds", "from": { "option_set_type": "options_array", "options": "[Array]" } },
        "flaws": { "choose": 1, "type": "flaws", "from": { "option_set_type": "options_array", "options": "[Array]" } },
        "url": "/api/2014/backgrounds/soldier",
        "updated_at": "2025-04-08T21:13:55.880Z"
      },
      {
        "index": "urchin",
        "name": "Urchin",
        "starting_proficiencies": [
          { "index": "skill-sleight-of-hand", "name": "Skill: Sleight of Hand", "url": "/api/2014/proficiencies/skill-sleight-of-hand" },
          { "index": "skill-stealth", "name": "Skill: Stealth", "url": "/api/2014/proficiencies/skill-stealth" }
        ],
        "language_options": null,
        "starting_equipment": [
          { "equipment": "[Object]", "quantity": 1 },
          { "equipment": "[Object]", "quantity": 1 }
        ],
        "starting_equipment_options": [
          { "choose": 1, "type": "equipment", "from": "[Object]" }
        ],
        "feature": {
          "name": "City Secrets",
          "desc": [
            "You know the secret patterns and flow to cities and can find passages through the urban sprawl that others would miss. When you are not in combat, you (and companions you lead) can travel between any two locations in a city twice as fast as your speed would normally allow."
          ]
        },
        "personality_traits": {
          "choose": 2,
          "type": "personality_traits",
          "from": { "option_set_type": "options_array", "options": "[Array]" }
        },
        "ideals": { "choose": 1, "type": "ideals", "from": { "option_set_type": "options_array", "options": "[Array]" } },
        "bonds": { "choose": 1, "type": "bonds", "from": { "option_set_type": "options_array", "options": "[Array]" } },
        "flaws": { "choose": 1, "type": "flaws", "from": { "option_set_type": "options_array", "options": "[Array]" } },
        "url": "/api/2014/backgrounds/urchin",
        "updated_at": "2025-04-08T21:13:55.880Z"
      }                                    
];    