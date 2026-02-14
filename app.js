// Exemple de JSON (à remplacer par ton fichier complet)
const plantes = [
    {
        "nom": "pêcher",
        "nomEN": "peach tree",
        "type": "arbre fruitier",
        "entretien": [
            {"operation": "plantation", "mois": 11, "details": "Planter en automne, 3-4 m entre arbres."},
            {"operation": "taille", "mois": 2, "details": "Supprimer branches mortes et retailler l'année précédente."},
            {"operation": "récolte", "mois": 7, "details": "Récolter les pêches bien colorées et fermes."},
            {"operation": "engrais", "mois": 3, "details": "Engrais riche en potassium et phosphore au pied de l'arbre."}
        ]
    },
    {
        "nom": "prunier mirabelle",
        "nomEN": "mirabelle plum",
        "type": "arbre fruitier",
        "entretien": [
            {"operation": "plantation", "mois": 11, "details": "Planter en automne, 3-4 m entre arbres."},
            {"operation": "taille", "mois": 2, "details": "Taille de formation et entretien."},
            {"operation": "récolte", "mois": 8, "details": "Récolter quand les fruits sont bien colorés."},
            {"operation": "engrais", "mois": 3, "details": "Engrais équilibré autour du tronc."}
        ]
    },
    {
        "nom": "prunier prune rouge",
        "nomEN": "red plum tree",
        "type": "arbre fruitier",
        "entretien": [
            {"operation": "plantation", "mois": 11, "details": "Planter en automne, 3-4 m entre arbres."},
            {"operation": "taille", "mois": 2, "details": "Supprimer branches mortes et trop serrées."},
            {"operation": "récolte", "mois": 8, "details": "Récolter à maturité."},
            {"operation": "engrais", "mois": 3, "details": "Engrais équilibré autour du tronc."}
        ]
    },
    {
        "nom": "prunier reine claude",
        "nomEN": "greengage plum",
        "type": "arbre fruitier",
        "entretien": [
            {"operation": "plantation", "mois": 11, "details": "Planter en automne, 3-4 m entre arbres."},
            {"operation": "taille", "mois": 2, "details": "Supprimer branches mortes et trop serrées."},
            {"operation": "récolte", "mois": 8, "details": "Récolter quand le fruit est bien mûr."},
            {"operation": "engrais", "mois": 3, "details": "Engrais équilibré autour du tronc."}
        ]
    },
    {
        "nom": "noisettier",
        "nomEN": "hazel",
        "type": "arbre fruitier",
        "entretien": [
            {"operation": "plantation", "mois": 11, "details": "Planter en automne, 3-4 m entre arbustes."},
            {"operation": "taille", "mois": 2, "details": "Éclaircir le centre et supprimer branches mortes."},
            {"operation": "récolte", "mois": 9, "details": "Récolter les noisettes lorsqu'elles tombent naturellement."},
            {"operation": "engrais", "mois": 3, "details": "Engrais organique au pied du plant."}
        ]
    },
    {
        "nom": "noyer",
        "nomEN": "walnut tree",
        "type": "arbre fruitier",
        "entretien": [
            {"operation": "plantation", "mois": 11, "details": "Planter en automne, 8-10 m entre arbres."},
            {"operation": "taille", "mois": 2, "details": "Supprimer branches mortes et faibles."},
            {"operation": "récolte", "mois": 10, "details": "Récolter les noix lorsqu'elles tombent."},
            {"operation": "engrais", "mois": 3, "details": "Appliquer engrais organique ou compost autour du tronc."}
        ]
    },
    {
        "nom": "tamaris",
        "nomEN": "tamarisk",
        "type": "arbre ornemental",
        "entretien": [
            {"operation": "plantation", "mois": 3, "details": "Planter au printemps, sol bien drainé."},
            {"operation": "taille", "mois": 2, "details": "Tailler pour maintenir la forme."},
            {"operation": "engrais", "mois": 4, "details": "Engrais organique au printemps."}
        ]
    },
    {
        "nom": "fraisier",
        "nomEN": "strawberry",
        "type": "fruitier",
        "entretien": [
            {"operation": "plantation", "mois": 3, "details": "Espacement 30-40 cm, ajouter compost."},
            {"operation": "taille", "mois": 7, "details": "Supprimer feuilles mortes et stolons inutiles."},
            {"operation": "récolte", "mois": 6, "details": "Récolter à maturité, pédoncule intact."},
            {"operation": "engrais", "mois": 4, "details": "Engrais riche en potassium toutes les 3 semaines."}
        ]
    },
    {
        "nom": "framboisier remontant",
        "nomEN": "raspberry",
        "type": "fruitier",
        "entretien": [
            {"operation": "plantation", "mois": 3, "details": "Espacement 50 cm, sol fertile."},
            {"operation": "taille", "mois": 2, "details": "Supprimer bois morts et anciens cannes."},
            {"operation": "récolte", "mois": 7, "details": "Récolter régulièrement les fruits mûrs."},
            {"operation": "engrais", "mois": 4, "details": "Engrais organique ou compost au pied."}
        ]
    },
    {
        "nom": "groseiller",
        "nomEN": "redcurrant",
        "type": "fruitier",
        "entretien": [
            {"operation": "plantation", "mois": 11, "details": "Planter en automne, 1-1,5 m entre arbustes."},
            {"operation": "taille", "mois": 2, "details": "Supprimer branches anciennes et mal orientées."},
            {"operation": "récolte", "mois": 7, "details": "Récolter les grappes à maturité."},
            {"operation": "engrais", "mois": 3, "details": "Engrais organique au printemps."}
        ]
    },
    {
        "nom": "vigne",
        "nomEN": "grape vine",
        "type": "fruitier",
        "entretien": [
            {"operation": "plantation", "mois": 3, "details": "Planter au printemps, distance 1,5-2 m entre pieds."},
            {"operation": "taille", "mois": 2, "details": "Taille hivernale pour contrôler les branches."},
            {"operation": "récolte", "mois": 9, "details": "Récolter raisins à pleine maturité."},
            {"operation": "engrais", "mois": 4, "details": "Engrais riche en potassium et phosphore."}
        ]
    },
    {
        "nom": "rhubarbe",
        "nomEN": "rhubarb",
        "type": "légume",
        "entretien": [
            {"operation": "plantation", "mois": 4, "details": "Planter à 60 cm d'espacement, sol riche et humide."},
            {"operation": "récolte", "mois": 5, "details": "Récolter les pétioles, laisser le cœur intact."},
            {"operation": "engrais", "mois": 3, "details": "Engrais organique avant le démarrage."}
        ]
    },
    {
        "nom": "artichaut",
        "nomEN": "artichoke",
        "type": "légume",
        "entretien": [
            {"operation": "plantation", "mois": 4, "details": "Planter à 1 m entre plants, sol riche et frais."},
            {"operation": "récolte", "mois": 6, "details": "Récolter les capitules avant ouverture complète."},
            {"operation": "engrais", "mois": 3, "details": "Appliquer engrais riche en potassium."}
        ]
    },
    {
        "nom": "oseille",
        "nomEN": "sorrel",
        "type": "légume",
        "entretien": [
            {"operation": "semis", "mois": 3, "details": "Semer 2-3 cm de profondeur, 30 cm entre rangs."},
            {"operation": "récolte", "mois": 5, "details": "Cueillir les feuilles tendres régulièrement."},
            {"operation": "engrais", "mois": 4, "details": "Engrais organique ou compost au pied."}
        ]
    },
    {
        "nom": "menthe",
        "nomEN": "mint",
        "type": "herbe aromatique",
        "entretien": [
            {"operation": "plantation", "mois": 4, "details": "Planter à 30 cm d'espacement, sol frais et drainé."},
            {"operation": "récolte", "mois": 6, "details": "Couper les tiges avant floraison pour favoriser le feuillage."},
            {"operation": "engrais", "mois": 4, "details": "Ajouter compost ou engrais équilibré au printemps."}
        ]
    },
    {
        "nom": "thym",
        "nomEN": "thyme",
        "type": "herbe aromatique",
        "entretien": [
            {"operation": "plantation", "mois": 4, "details": "Planter à 30 cm, sol léger et drainé."},
            {"operation": "récolte", "mois": 6, "details": "Couper régulièrement les tiges pour stimuler la croissance."},
            {"operation": "engrais", "mois": 3, "details": "Peu d'engrais nécessaire, un peu de compost suffit."}
        ]
    },
    {
        "nom": "cerisier",
        "nomEN": "cherry tree",
        "type": "arbre fruitier",
        "entretien": [
            {"operation": "plantation", "mois": 11, "details": "Planter en automne, 6-8 m entre arbres, sol bien drainé."},
            {"operation": "taille", "mois": 10, "details": "Taille légère après récolte, supprimer bois mort."},
            {"operation": "récolte", "mois": 6, "details": "Récolter les cerises bien colorées et fermes."},
            {"operation": "engrais", "mois": 3, "details": "Engrais complet au pied de l'arbre au début du printemps."}
        ]
    },
    {
        "nom": "merisier",
        "nomEN": "wild cherry",
        "type": "arbre fruitier",
        "entretien": [
            {"operation": "plantation", "mois": 11, "details": "Planter en automne, 8-10 m entre arbres."},
            {"operation": "taille", "mois": 10, "details": "Taille légère d'entretien après la chute des feuilles."},
            {"operation": "récolte", "mois": 7, "details": "Récolter les merises à maturité."},
            {"operation": "engrais", "mois": 3, "details": "Compost ou engrais organique au pied au printemps."}
        ]
    },
    {
        "nom": "cognassier",
        "nomEN": "quince",
        "type": "arbre fruitier",
        "entretien": [
            {"operation": "plantation", "mois": 11, "details": "Planter en automne, 4-5 m entre arbres, sol profond."},
            {"operation": "taille", "mois": 2, "details": "Éclaircir le centre et supprimer branches mortes."},
            {"operation": "récolte", "mois": 10, "details": "Récolter les coings bien jaunes après les premières gelées."},
            {"operation": "engrais", "mois": 3, "details": "Engrais organique ou compost au pied au printemps."}
        ]
    },
    {
        "nom": "romarin",
        "nomEN": "rosemary",
        "type": "herbe aromatique",
        "entretien": [
            {"operation": "plantation", "mois": 4, "details": "Planter à 40 cm d'espacement, sol léger et bien drainé."},
            {"operation": "taille", "mois": 3, "details": "Tailler légèrement pour maintenir un port compact."},
            {"operation": "récolte", "mois": 6, "details": "Couper les tiges au fur et à mesure des besoins."},
            {"operation": "engrais", "mois": 4, "details": "Peu exigeant, un peu de compost suffit."}
        ]
    },
    {
        "nom": "persil",
        "nomEN": "parsley",
        "type": "herbe aromatique",
        "entretien": [
            {"operation": "semis", "mois": 3, "details": "Semer en place, 20 cm entre rangs, levée lente (3 semaines)."},
            {"operation": "récolte", "mois": 6, "details": "Cueillir les tiges extérieures régulièrement."},
            {"operation": "engrais", "mois": 5, "details": "Engrais azoté léger pour favoriser le feuillage."}
        ]
    },
    {
        "nom": "coriandre",
        "nomEN": "coriander",
        "type": "herbe aromatique",
        "entretien": [
            {"operation": "semis", "mois": 4, "details": "Semer en place à 20 cm d'espacement, mi-ombre."},
            {"operation": "récolte", "mois": 6, "details": "Cueillir les feuilles avant la floraison."},
            {"operation": "engrais", "mois": 5, "details": "Sol ordinaire, peu d'engrais nécessaire."}
        ]
    },
    {
        "nom": "rosier",
        "nomEN": "rose",
        "type": "fleur",
        "entretien": [
            {"operation": "plantation", "mois": 11, "details": "Planter à racines nues en automne, 50-80 cm entre pieds."},
            {"operation": "taille", "mois": 3, "details": "Tailler à 3-5 yeux, supprimer bois mort et branches faibles."},
            {"operation": "engrais", "mois": 4, "details": "Engrais spécial rosiers au pied, renouveler en juin."},
            {"operation": "traitement", "mois": 5, "details": "Traiter préventivement contre pucerons et maladies fongiques."}
        ]
    },
    {
        "nom": "laurier rose",
        "nomEN": "oleander",
        "type": "arbuste ornemental",
        "entretien": [
            {"operation": "plantation", "mois": 4, "details": "Planter au printemps en plein soleil, sol bien drainé."},
            {"operation": "taille", "mois": 3, "details": "Rabattre d'un tiers les branches ayant fleuri."},
            {"operation": "engrais", "mois": 5, "details": "Engrais pour plantes fleuries tous les 15 jours en été."},
            {"operation": "hivernage", "mois": 11, "details": "Protéger du gel avec un voile d'hivernage ou rentrer en pot."}
        ]
    },
    {
        "nom": "muguet",
        "nomEN": "lily of the valley",
        "type": "fleur",
        "entretien": [
            {"operation": "plantation", "mois": 10, "details": "Planter les griffes à 3 cm de profondeur, 10 cm d'espacement, à l'ombre."},
            {"operation": "récolte", "mois": 5, "details": "Cueillir les brins en mai en tirant délicatement."},
            {"operation": "engrais", "mois": 3, "details": "Terreau de feuilles ou compost en surface au printemps."}
        ]
    },
    {
        "nom": "fusain",
        "nomEN": "euonymus",
        "type": "arbuste ornemental",
        "entretien": [
            {"operation": "plantation", "mois": 11, "details": "Planter en automne, 1-2 m entre arbustes."},
            {"operation": "taille", "mois": 3, "details": "Taille de mise en forme au printemps."},
            {"operation": "engrais", "mois": 4, "details": "Engrais organique ou compost au pied au printemps."}
        ]
    },
    {
        "nom": "oranger du mexique",
        "nomEN": "mexican orange",
        "type": "arbuste ornemental",
        "entretien": [
            {"operation": "plantation", "mois": 4, "details": "Planter au printemps, sol bien drainé, emplacement abrité."},
            {"operation": "taille", "mois": 6, "details": "Tailler légèrement après la floraison pour maintenir la forme."},
            {"operation": "engrais", "mois": 4, "details": "Engrais pour arbustes à fleurs au printemps."}
        ]
    },
    {
        "nom": "fuchsia",
        "nomEN": "fuchsia",
        "type": "fleur",
        "entretien": [
            {"operation": "plantation", "mois": 5, "details": "Planter après les gelées, mi-ombre, sol frais et riche."},
            {"operation": "taille", "mois": 3, "details": "Rabattre les tiges à 10 cm du sol au printemps."},
            {"operation": "engrais", "mois": 5, "details": "Engrais liquide pour plantes fleuries tous les 15 jours."},
            {"operation": "hivernage", "mois": 11, "details": "Pailler le pied ou rentrer en pot hors gel."}
        ]
    },
    {
        "nom": "géranium vivace",
        "nomEN": "hardy geranium",
        "type": "fleur",
        "entretien": [
            {"operation": "plantation", "mois": 4, "details": "Planter au printemps, 30-40 cm d'espacement, sol ordinaire."},
            {"operation": "taille", "mois": 7, "details": "Rabattre le feuillage après la première floraison pour relancer."},
            {"operation": "engrais", "mois": 4, "details": "Compost en surface au printemps, peu exigeant."}
        ]
    },
    {
        "nom": "arbre à papillon noir",
        "nomEN": "butterfly bush",
        "type": "arbuste ornemental",
        "entretien": [
            {"operation": "plantation", "mois": 3, "details": "Planter au printemps, plein soleil, sol bien drainé."},
            {"operation": "taille", "mois": 3, "details": "Rabattre sévèrement à 30 cm du sol chaque printemps."},
            {"operation": "engrais", "mois": 4, "details": "Engrais organique au pied au printemps."}
        ]
    },
    {
        "nom": "clématite",
        "nomEN": "clematis",
        "type": "plante grimpante",
        "entretien": [
            {"operation": "plantation", "mois": 3, "details": "Planter au printemps, pied à l'ombre, tête au soleil."},
            {"operation": "taille", "mois": 2, "details": "Tailler selon le groupe : légère ou sévère après floraison."},
            {"operation": "engrais", "mois": 4, "details": "Engrais riche en potassium au printemps pour la floraison."},
            {"operation": "palissage", "mois": 5, "details": "Guider les tiges sur le support au fur et à mesure."}
        ]
    },
    {
        "nom": "olivier",
        "nomEN": "olive tree",
        "type": "arbre ornemental",
        "entretien": [
            {"operation": "plantation", "mois": 4, "details": "Planter au printemps, plein soleil, sol bien drainé."},
            {"operation": "taille", "mois": 3, "details": "Taille d'entretien pour aérer le centre de l'arbre."},
            {"operation": "engrais", "mois": 4, "details": "Engrais complet au printemps, compost en automne."},
            {"operation": "hivernage", "mois": 11, "details": "Protéger avec un voile d'hivernage si gelées prévues."}
        ]
    },
    {
        "nom": "hortensia",
        "nomEN": "hydrangea",
        "type": "arbuste ornemental",
        "entretien": [
            {"operation": "plantation", "mois": 3, "details": "Planter au printemps, mi-ombre, sol acide et frais."},
            {"operation": "taille", "mois": 3, "details": "Supprimer les fleurs fanées et le bois mort."},
            {"operation": "engrais", "mois": 4, "details": "Engrais pour plantes de terre de bruyère au printemps."}
        ]
    },
    {
        "nom": "sauge arbustive",
        "nomEN": "salvia",
        "type": "fleur",
        "entretien": [
            {"operation": "plantation", "mois": 4, "details": "Planter au printemps, plein soleil, sol bien drainé."},
            {"operation": "taille", "mois": 3, "details": "Rabattre à 20 cm du sol au printemps pour favoriser la repousse."},
            {"operation": "engrais", "mois": 4, "details": "Peu exigeante, un apport de compost suffit."}
        ]
    },
    {
        "nom": "oeillet d'inde",
        "nomEN": "marigold",
        "type": "fleur",
        "entretien": [
            {"operation": "semis", "mois": 3, "details": "Semer sous abri, repiquer après les gelées à 20 cm."},
            {"operation": "plantation", "mois": 5, "details": "Planter en plein soleil, sol ordinaire."},
            {"operation": "engrais", "mois": 6, "details": "Engrais liquide pour plantes fleuries tous les 15 jours."}
        ]
    },
    {
        "nom": "coquelicot",
        "nomEN": "poppy",
        "type": "fleur",
        "entretien": [
            {"operation": "semis", "mois": 9, "details": "Semer à la volée en automne, sol pauvre et bien drainé."},
            {"operation": "semis", "mois": 3, "details": "Ou semer au printemps, ne pas recouvrir les graines."}
        ]
    },
    {
        "nom": "perce-neige",
        "nomEN": "snowdrop",
        "type": "fleur",
        "entretien": [
            {"operation": "plantation", "mois": 9, "details": "Planter les bulbes à 5-8 cm de profondeur, 5 cm d'espacement."},
            {"operation": "engrais", "mois": 3, "details": "Compost léger en surface après la floraison."}
        ]
    },
    {
        "nom": "lavande",
        "nomEN": "lavender",
        "type": "arbuste ornemental",
        "entretien": [
            {"operation": "plantation", "mois": 4, "details": "Planter au printemps, plein soleil, sol sec et drainé."},
            {"operation": "taille", "mois": 8, "details": "Tailler après floraison en arrondissant la touffe, ne pas couper dans le vieux bois."},
            {"operation": "récolte", "mois": 7, "details": "Couper les épis en début de floraison pour séchage."}
        ]
    },
    {
        "nom": "camélia",
        "nomEN": "camellia",
        "type": "arbuste ornemental",
        "entretien": [
            {"operation": "plantation", "mois": 3, "details": "Planter au printemps, mi-ombre, sol acide et frais."},
            {"operation": "taille", "mois": 5, "details": "Taille légère après la floraison pour maintenir la forme."},
            {"operation": "engrais", "mois": 4, "details": "Engrais pour plantes de terre de bruyère au printemps."},
            {"operation": "paillage", "mois": 6, "details": "Pailler le pied pour garder la fraîcheur en été."}
        ]
    },
    {
        "nom": "pivoines",
        "nomEN": "peony",
        "type": "fleur",
        "entretien": [
            {"operation": "plantation", "mois": 10, "details": "Planter en automne, yeux à 2-3 cm sous la surface, 80 cm entre pieds."},
            {"operation": "taille", "mois": 11, "details": "Couper le feuillage fané au ras du sol en automne."},
            {"operation": "engrais", "mois": 3, "details": "Engrais riche en potassium au printemps pour la floraison."},
            {"operation": "tuteurage", "mois": 4, "details": "Installer des tuteurs avant la floraison pour soutenir les tiges."}
        ]
    },
    {
        "nom": "iris d'Alger",
        "nomEN": "Algerian iris",
        "type": "fleur",
        "entretien": [
            {"operation": "plantation", "mois": 9, "details": "Planter les rhizomes à fleur de sol, 20-30 cm d'espacement, mi-ombre."},
            {"operation": "taille", "mois": 3, "details": "Supprimer les feuilles abîmées et les hampes fanées."},
            {"operation": "engrais", "mois": 4, "details": "Engrais pauvre en azote pour favoriser la floraison."}
        ]
    },
    {
        "nom": "croix de Jérusalem",
        "nomEN": "Maltese cross",
        "type": "fleur",
        "entretien": [
            {"operation": "plantation", "mois": 3, "details": "Planter au printemps, plein soleil, sol ordinaire et drainé."},
            {"operation": "semis", "mois": 4, "details": "Semer sous abri au printemps, repiquer après les gelées."},
            {"operation": "taille", "mois": 7, "details": "Supprimer les fleurs fanées pour prolonger la floraison."},
            {"operation": "engrais", "mois": 4, "details": "Compost en surface au printemps."}
        ]
    },
    {
        "nom": "azalée",
        "nomEN": "azalea",
        "type": "arbuste ornemental",
        "entretien": [
            {"operation": "plantation", "mois": 3, "details": "Planter au printemps, mi-ombre, sol acide et frais."},
            {"operation": "taille", "mois": 6, "details": "Taille légère après la floraison pour garder un port compact."},
            {"operation": "engrais", "mois": 4, "details": "Engrais pour plantes de terre de bruyère au printemps."},
            {"operation": "paillage", "mois": 5, "details": "Pailler avec des écorces de pin pour maintenir l'acidité."}
        ]
    },
    {
        "nom": "chèvrefeuille",
        "nomEN": "honeysuckle",
        "type": "plante grimpante",
        "entretien": [
            {"operation": "plantation", "mois": 11, "details": "Planter en automne, mi-ombre, sol frais et humifère."},
            {"operation": "taille", "mois": 3, "details": "Tailler les branches mortes et éclaircir le pied."},
            {"operation": "palissage", "mois": 4, "details": "Guider les tiges sur le support."},
            {"operation": "engrais", "mois": 4, "details": "Compost au pied au printemps."}
        ]
    },
    {
        "nom": "giroflée",
        "nomEN": "wallflower",
        "type": "fleur",
        "entretien": [
            {"operation": "semis", "mois": 5, "details": "Semer en pépinière, repiquer en automne à 25 cm."},
            {"operation": "plantation", "mois": 10, "details": "Planter en automne pour floraison printanière, sol drainé."},
            {"operation": "engrais", "mois": 3, "details": "Engrais pour plantes fleuries au début du printemps."}
        ]
    },
    {
        "nom": "pomme de terre",
        "nomEN": "potato",
        "type": "légume",
        "entretien": [
            {"operation": "plantation", "mois": 4, "details": "Planter les tubercules germés à 10-15 cm de profondeur, 40 cm entre plants."},
            {"operation": "buttage", "mois": 5, "details": "Butter les pieds quand les tiges atteignent 15-20 cm."},
            {"operation": "récolte", "mois": 7, "details": "Récolter quand le feuillage jaunit et se dessèche."},
            {"operation": "engrais", "mois": 3, "details": "Enfouir du compost bien décomposé avant la plantation."}
        ]
    },
    {
        "nom": "haricot vert",
        "nomEN": "green bean",
        "type": "légume",
        "entretien": [
            {"operation": "semis", "mois": 5, "details": "Semer en place à 3-4 cm de profondeur, rangs espacés de 40 cm."},
            {"operation": "récolte", "mois": 7, "details": "Récolter régulièrement les haricots jeunes et tendres."},
            {"operation": "engrais", "mois": 5, "details": "Sol enrichi au compost à l'automne précédent, peu d'engrais."}
        ]
    },
    {
        "nom": "courgette",
        "nomEN": "zucchini",
        "type": "légume",
        "entretien": [
            {"operation": "semis", "mois": 4, "details": "Semer sous abri en godets, 2 graines par godet."},
            {"operation": "plantation", "mois": 5, "details": "Repiquer après les gelées, 1 m entre pieds, sol riche."},
            {"operation": "récolte", "mois": 7, "details": "Récolter les courgettes jeunes (15-20 cm) régulièrement."},
            {"operation": "engrais", "mois": 6, "details": "Engrais riche en potassium tous les 15 jours en été."}
        ]
    },
    {
        "nom": "betterave",
        "nomEN": "beetroot",
        "type": "légume",
        "entretien": [
            {"operation": "semis", "mois": 4, "details": "Semer en place à 2 cm de profondeur, éclaircir à 15 cm."},
            {"operation": "récolte", "mois": 7, "details": "Récolter quand la racine atteint 5-8 cm de diamètre."},
            {"operation": "engrais", "mois": 4, "details": "Sol enrichi au compost, éviter l'excès d'azote."}
        ]
    },
    {
        "nom": "tomate",
        "nomEN": "tomato",
        "type": "légume",
        "entretien": [
            {"operation": "semis", "mois": 3, "details": "Semer sous abri à 20°C, repiquer en godets à 2 feuilles."},
            {"operation": "plantation", "mois": 5, "details": "Planter après les gelées, 50 cm entre pieds, tuteurer."},
            {"operation": "taille", "mois": 6, "details": "Supprimer les gourmands et les feuilles basses."},
            {"operation": "récolte", "mois": 7, "details": "Récolter les fruits bien colorés au fur et à mesure."},
            {"operation": "engrais", "mois": 6, "details": "Engrais riche en potassium tous les 15 jours."}
        ]
    },
    {
        "nom": "aubergine",
        "nomEN": "eggplant",
        "type": "légume",
        "entretien": [
            {"operation": "semis", "mois": 2, "details": "Semer sous abri chauffé à 20-25°C."},
            {"operation": "plantation", "mois": 5, "details": "Repiquer après les gelées, 50 cm entre pieds, plein soleil."},
            {"operation": "récolte", "mois": 8, "details": "Récolter quand le fruit est bien coloré et brillant."},
            {"operation": "engrais", "mois": 6, "details": "Engrais riche en potassium toutes les 2 semaines."}
        ]
    },
    {
        "nom": "poivron",
        "nomEN": "bell pepper",
        "type": "légume",
        "entretien": [
            {"operation": "semis", "mois": 2, "details": "Semer sous abri chauffé à 20-25°C."},
            {"operation": "plantation", "mois": 5, "details": "Repiquer après les gelées, 50 cm entre pieds, plein soleil."},
            {"operation": "récolte", "mois": 8, "details": "Récolter vert ou attendre la coloration complète."},
            {"operation": "engrais", "mois": 6, "details": "Engrais riche en potassium toutes les 2 semaines."}
        ]
    },
    {
        "nom": "butternut",
        "nomEN": "butternut squash",
        "type": "légume",
        "entretien": [
            {"operation": "semis", "mois": 4, "details": "Semer sous abri en godets, 2 graines par godet."},
            {"operation": "plantation", "mois": 5, "details": "Repiquer après les gelées, 1,5 m entre pieds, sol riche."},
            {"operation": "récolte", "mois": 9, "details": "Récolter quand le pédoncule est sec et liégeux."},
            {"operation": "engrais", "mois": 6, "details": "Engrais organique ou compost au pied en été."}
        ]
    },
    {
        "nom": "mâche",
        "nomEN": "corn salad",
        "type": "légume",
        "entretien": [
            {"operation": "semis", "mois": 9, "details": "Semer en place à 1 cm de profondeur, rangs espacés de 20 cm."},
            {"operation": "récolte", "mois": 11, "details": "Récolter les rosettes entières selon les besoins."},
            {"operation": "engrais", "mois": 9, "details": "Sol ordinaire, peu d'engrais nécessaire."}
        ]
    },
    {
        "nom": "mesclun",
        "nomEN": "mesclun",
        "type": "légume",
        "entretien": [
            {"operation": "semis", "mois": 3, "details": "Semer à la volée ou en rangs, sol frais et léger."},
            {"operation": "semis", "mois": 9, "details": "Semer à nouveau en automne pour récolte d'hiver."},
            {"operation": "récolte", "mois": 5, "details": "Couper les jeunes feuilles à 3-4 cm du sol."},
            {"operation": "engrais", "mois": 3, "details": "Compost léger en surface avant le semis."}
        ]
    },
    {
        "nom": "petit pois d'hiver",
        "nomEN": "winter pea",
        "type": "légume",
        "entretien": [
            {"operation": "semis", "mois": 10, "details": "Semer en place à 3 cm de profondeur, rangs espacés de 40 cm."},
            {"operation": "tuteurage", "mois": 3, "details": "Installer des rames ou filet quand les plants atteignent 10 cm."},
            {"operation": "récolte", "mois": 5, "details": "Récolter les gousses bien remplies mais encore tendres."},
            {"operation": "engrais", "mois": 10, "details": "Sol enrichi au compost, pas d'engrais azoté (légumineuse)."}
        ]
    },
    {
        "nom": "ail",
        "nomEN": "garlic",
        "type": "légume",
        "entretien": [
            {"operation": "plantation", "mois": 10, "details": "Planter les caïeux pointe en haut à 3 cm de profondeur, 15 cm entre plants."},
            {"operation": "récolte", "mois": 7, "details": "Récolter quand les feuilles jaunissent et retombent."},
            {"operation": "engrais", "mois": 10, "details": "Sol bien drainé, pas d'engrais frais ni fumier."}
        ]
    },
    {
        "nom": "échalote",
        "nomEN": "shallot",
        "type": "légume",
        "entretien": [
            {"operation": "plantation", "mois": 2, "details": "Planter les bulbes pointe en haut, affleurant, 15 cm entre plants."},
            {"operation": "récolte", "mois": 7, "details": "Récolter quand le feuillage jaunit et se couche."},
            {"operation": "engrais", "mois": 2, "details": "Sol bien drainé, compost de l'automne précédent suffit."}
        ]
    },
    {
        "nom": "radis",
        "nomEN": "radish",
        "type": "légume",
        "entretien": [
            {"operation": "semis", "mois": 3, "details": "Semer en place à 1 cm de profondeur, éclaircir à 3-5 cm."},
            {"operation": "semis", "mois": 9, "details": "Semer à nouveau en fin d'été pour récolte d'automne."},
            {"operation": "récolte", "mois": 4, "details": "Récolter 3-4 semaines après le semis, ne pas laisser grossir."},
            {"operation": "engrais", "mois": 3, "details": "Sol léger et frais, peu d'engrais nécessaire."}
        ]
    },
    {
        "nom": "basilic",
        "nomEN": "basil",
        "type": "herbe aromatique",
        "entretien": [
            {"operation": "semis", "mois": 3, "details": "Semer sous abri à 20°C, repiquer après les gelées."},
            {"operation": "plantation", "mois": 5, "details": "Planter en plein soleil, 25 cm entre pieds, sol riche."},
            {"operation": "récolte", "mois": 6, "details": "Pincer les sommités régulièrement pour favoriser la ramification."},
            {"operation": "engrais", "mois": 6, "details": "Engrais liquide organique tous les 15 jours."}
        ]
    }
];

// Clé API Perenual
const PERENUAL_API_KEY = 'sk-cfrx699048370f31d14827';

// Mois en français
const moisFR = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

// DOM
const viewSelect = document.getElementById('view');
const monthView = document.getElementById('monthView');
const plantView = document.getElementById('plantView');
const monthSelect = document.getElementById('month');
const plantSelect = document.getElementById('plant');
const output = document.getElementById('output');

// Remplir le select plantes par type puis par nom
const types = [...new Set(plantes.map(p => p.type))].sort((a, b) => a.localeCompare(b));
types.forEach(type => {
    const group = document.createElement('optgroup');
    group.label = type.charAt(0).toUpperCase() + type.slice(1);
    plantes
        .filter(p => p.type === type)
        .sort((a, b) => a.nom.localeCompare(b.nom))
        .forEach(p => {
            const option = document.createElement('option');
            option.value = p.nom;
            option.textContent = p.nom;
            group.appendChild(option);
        });
    plantSelect.appendChild(group);
});

// Gestion de l'affichage
viewSelect.addEventListener('change', () => {
    output.innerHTML = '';
    if (viewSelect.value === 'month') {
        monthView.style.display = 'block';
        plantView.style.display = 'none';
        showMonth();
    } else {
        monthView.style.display = 'none';
        plantView.style.display = 'block';
        showPlant();
    }
});

monthSelect.addEventListener('change', showMonth);
plantSelect.addEventListener('change', showPlant);

// Fonctions
function showMonth() {
    const mois = parseInt(monthSelect.value);
    let html = `<h2>Opérations pour ${moisFR[mois - 1]}</h2>`;
    // Grouper par type, puis trier par nom dans chaque type
    const typesAvecOps = [...new Set(plantes.map(p => p.type))].sort((a, b) => a.localeCompare(b));
    typesAvecOps.forEach(type => {
        const plantesType = plantes
            .filter(p => p.type === type)
            .sort((a, b) => a.nom.localeCompare(b.nom));
        const rows = [];
        plantesType.forEach(p => {
            const ops = p.entretien.filter(op => op.mois === mois);
            ops.forEach(op => {
                rows.push(`<tr><td>${p.nom}</td><td>${op.operation}</td><td class="details">${op.details}</td><td><button class="btn btn-sm btn-outline-success" onclick="fetchDetails('${p.nom.replace(/'/g, "\\'")}')">Détails</button></td></tr>`);
            });
        });
        if (rows.length > 0) {
            html += `<h5 class="mt-3">${type.charAt(0).toUpperCase() + type.slice(1)}</h5>`;
            html += `<table class="table table-striped table-hover"><thead><tr><th>Plante</th><th>Opération</th><th>Détails</th><th></th></tr></thead><tbody>`;
            html += rows.join('');
            html += '</tbody></table>';
        }
    });
    output.innerHTML = html;
}

function showPlant() {
    const plantName = plantSelect.value;
    const plante = plantes.find(p => p.nom === plantName);
    if (!plante) {
        output.innerHTML = "Plante non trouvée";
        return;
    }
    // Trier les opérations par mois
    const ops = plante.entretien.sort((a, b) => a.mois - b.mois);
    let html = `<h2>Opérations pour ${plante.nom}</h2>`;
    html += `<p><button class="btn btn-outline-success btn-sm mb-2" onclick="fetchDetails('${plante.nom.replace(/'/g, "\\'")}')">Voir les détails de cette plante</button></p>`;
    html += `<table class="table table-striped table-hover"><thead><tr><th>Mois</th><th>Opération</th><th>Détails</th></tr></thead><tbody>`;
    ops.forEach(op => {
        html += `<tr><td>${moisFR[op.mois - 1]}</td><td>${op.operation}</td><td class="details">${op.details}</td></tr>`;
    });
    html += '</tbody></table>';
    output.innerHTML = html;
}

// Cache localStorage pour les détails de plantes
const CACHE_KEY = 'perenual_cache';

function getCache() {
    try {
        return JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
    } catch { return {}; }
}

function setCache(nomPlante, data) {
    const cache = getCache();
    cache[nomPlante] = data;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

// Fonction pour récupérer les détails d'une plante via l'API Perenual
async function fetchDetails(nomPlante) {
    const modalBody = document.getElementById('plantModalBody');
    const modalLabel = document.getElementById('plantModalLabel');
    modalLabel.textContent = `Détails : ${nomPlante}`;
    modalBody.innerHTML = '<div class="text-center my-4"><div class="spinner-border text-success" role="status"><span class="visually-hidden">Chargement...</span></div><p class="mt-2">Recherche en cours...</p></div>';

    const modal = new bootstrap.Modal(document.getElementById('plantModal'));
    modal.show();

    try {
        // Vérifier le cache
        const cache = getCache();
        if (cache[nomPlante]) {
            afficherDetails(nomPlante, cache[nomPlante], modalBody);
            return;
        }

        // Trouver le nom anglais pour la recherche API
        const planteObj = plantes.find(p => p.nom === nomPlante);
        const searchName = planteObj && planteObj.nomEN ? planteObj.nomEN : nomPlante;

        // Étape 1 : Rechercher la plante
        const searchUrl = `https://perenual.com/api/v2/species-list?key=${PERENUAL_API_KEY}&q=${encodeURIComponent(searchName)}`;
        const searchRes = await fetch(searchUrl);
        if (!searchRes.ok) {
            if (searchRes.status === 429) throw new Error('Limite de requêtes API atteinte. Réessayez demain.');
            throw new Error(`Erreur recherche : ${searchRes.status}`);
        }
        const searchData = await searchRes.json();

        if (!searchData.data || searchData.data.length === 0) {
            modalBody.innerHTML = `<div class="alert alert-warning">Aucun résultat trouvé pour « ${nomPlante} ».</div>`;
            return;
        }

        // Étape 2 : Récupérer l'id du premier résultat
        const speciesId = searchData.data[0].id;

        // Étape 3 : Récupérer les détails
        const detailsUrl = `https://perenual.com/api/v2/species/details/${speciesId}?key=${PERENUAL_API_KEY}`;
        const detailsRes = await fetch(detailsUrl);
        if (!detailsRes.ok) {
            if (detailsRes.status === 429) throw new Error('Limite de requêtes API atteinte. Réessayez demain.');
            throw new Error(`Erreur détails : ${detailsRes.status}`);
        }
        const plant = await detailsRes.json();

        // Sauvegarder dans le cache
        setCache(nomPlante, plant);

        afficherDetails(nomPlante, plant, modalBody);

    } catch (err) {
        modalBody.innerHTML = `<div class="alert alert-danger">Erreur lors de la récupération des données : ${err.message}</div>`;
    }
}

function afficherDetails(nomPlante, plant, modalBody) {
    let html = '<div class="row">';

    // Photo
    if (plant.default_image && plant.default_image.medium_url) {
        html += `<div class="col-md-4 mb-3"><img src="${plant.default_image.medium_url}" class="img-fluid rounded" alt="${plant.common_name || nomPlante}"></div>`;
        html += '<div class="col-md-8">';
    } else {
        html += '<div class="col-12">';
    }

    html += '<table class="table table-sm">';

    const ligne = (label, valeur) => {
        if (valeur !== undefined && valeur !== null && valeur !== '') {
            const texte = Array.isArray(valeur) ? valeur.join(', ') : valeur;
            html += `<tr><th class="text-nowrap">${label}</th><td>${texte}</td></tr>`;
        }
    };

    ligne('Nom commun', plant.common_name);
    ligne('Nom scientifique', plant.scientific_name);
    ligne('Famille', plant.family);
    ligne('Cycle', plant.cycle);
    ligne('Arrosage', plant.watering);
    ligne('Ensoleillement', plant.sunlight);

    if (plant.hardiness) {
        const h = plant.hardiness;
        ligne('Rusticité', h.min ? `Zone ${h.min} à ${h.max}` : h.max);
    }

    if (plant.dimensions) {
        const d = plant.dimensions;
        if (d.min_value || d.max_value) {
            ligne('Taille', `${d.min_value || '?'} - ${d.max_value || '?'} ${d.unit || ''} (${d.type || ''})`);
        }
    }

    ligne('Entretien', plant.maintenance);
    ligne('Fruit comestible', plant.edible_fruit != null ? (plant.edible_fruit ? 'Oui' : 'Non') : null);
    ligne('Feuille comestible', plant.edible_leaf != null ? (plant.edible_leaf ? 'Oui' : 'Non') : null);
    ligne('Toxique (humains)', plant.poisonous_to_humans != null ? (plant.poisonous_to_humans ? 'Oui' : 'Non') : null);
    ligne('Toxique (animaux)', plant.poisonous_to_pets != null ? (plant.poisonous_to_pets ? 'Oui' : 'Non') : null);

    html += '</table></div></div>';

    modalBody.innerHTML = html;
}

// Initial display
viewSelect.value = 'month';
monthSelect.value = new Date().getMonth() + 1;
monthView.style.display = 'block';
showMonth();
