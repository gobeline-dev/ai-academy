import { useState, useRef, useEffect } from 'react'

// ── Glossaire IA ──────────────────────────────────────────────────────────────
export const GLOSSARY = {
  // Fondations
  'gradient descent':     { fr: 'Descente de gradient', def: 'Algorithme d\'optimisation qui ajuste les paramètres d\'un modèle en suivant la direction opposée au gradient de la fonction de perte.' },
  'descente de gradient': { fr: 'Descente de gradient', def: 'Algorithme d\'optimisation qui ajuste les paramètres d\'un modèle en suivant la direction opposée au gradient de la fonction de perte.' },
  'backpropagation':      { fr: 'Rétropropagation', def: 'Algorithme calculant le gradient de chaque paramètre en propageant l\'erreur de la sortie vers l\'entrée via la règle de dérivation en chaîne.' },
  'rétropropagation':     { fr: 'Rétropropagation', def: 'Algorithme calculant le gradient de chaque paramètre en propageant l\'erreur de la sortie vers l\'entrée via la règle de dérivation en chaîne.' },
  'overfitting':          { fr: 'Surapprentissage', def: 'Le modèle mémorise les données d\'entraînement au lieu de généraliser : très performant sur les données vues, moins sur les nouvelles.' },
  'surapprentissage':     { fr: 'Surapprentissage', def: 'Le modèle mémorise les données d\'entraînement au lieu de généraliser : très performant sur les données vus, moins sur les nouvelles.' },
  'underfitting':         { fr: 'Sous-apprentissage', def: 'Le modèle est trop simple pour capturer les patterns des données — il échoue même sur les données d\'entraînement.' },
  'dropout':              { fr: 'Dropout', def: 'Technique de régularisation : désactive aléatoirement des neurones durant l\'entraînement pour forcer le réseau à ne pas dépendre d\'une seule connexion.' },
  'batch normalization':  { fr: 'Batch Normalization', def: 'Normalise les activations intermédiaires d\'un réseau pour stabiliser et accélérer l\'entraînement.' },
  'hyperparameter':       { fr: 'Hyperparamètre', def: 'Paramètre défini avant l\'entraînement (learning rate, taille de batch, nombre de couches...) et non appris par le modèle.' },
  'hyperparamètre':       { fr: 'Hyperparamètre', def: 'Paramètre défini avant l\'entraînement (learning rate, taille de batch, nombre de couches...) et non appris par le modèle.' },
  'learning rate':        { fr: 'Taux d\'apprentissage', def: 'Contrôle la taille des pas lors de la mise à jour des paramètres. Trop élevé → instabilité. Trop faible → convergence lente.' },
  'taux d\'apprentissage':{ fr: 'Taux d\'apprentissage', def: 'Contrôle la taille des pas lors de la mise à jour des paramètres. Trop élevé → instabilité. Trop faible → convergence lente.' },

  // Modèles
  'transformer':          { fr: 'Transformer', def: 'Architecture basée sur le mécanisme d\'attention, introduite en 2017. Fondation de tous les LLMs modernes (GPT, BERT, Llama...).' },
  'attention':            { fr: 'Attention', def: 'Mécanisme permettant au modèle de pondérer l\'importance de chaque token par rapport aux autres lors du traitement d\'une séquence.' },
  'embedding':            { fr: 'Embedding', def: 'Représentation vectorielle dense d\'un token, mot ou document dans un espace continu. Les mots sémantiquement proches ont des vecteurs proches.' },
  'token':                { fr: 'Token', def: 'Unité de base du texte pour un LLM. Peut être un mot, un sous-mot ou un caractère selon le tokenizer. GPT-4 utilise ~75% de mots entiers.' },
  'llm':                  { fr: 'Large Language Model', def: 'Modèle de langage entraîné sur des milliards de tokens. Peut générer, résumer, traduire et raisonner en langage naturel.' },
  'fine-tuning':          { fr: 'Fine-tuning', def: 'Ré-entraînement partiel d\'un modèle pré-entraîné sur un dataset spécifique pour l\'adapter à une tâche précise.' },
  'rag':                  { fr: 'RAG', def: 'Retrieval-Augmented Generation — combine un LLM avec une base de connaissances externe pour répondre avec des informations à jour et sourcées.' },
  'vector database':      { fr: 'Base de données vectorielle', def: 'Base de données optimisée pour stocker et rechercher des vecteurs par similarité cosinus ou euclidienne (ex: Pinecone, Weaviate, Chroma).' },
  'base vectorielle':     { fr: 'Base de données vectorielle', def: 'Base de données optimisée pour stocker et rechercher des vecteurs par similarité cosinus ou euclidienne (ex: Pinecone, Weaviate, Chroma).' },
  'prompt':               { fr: 'Prompt', def: 'Instruction ou contexte textuel fourni à un LLM. La qualité du prompt influence directement la qualité de la réponse.' },
  'context window':       { fr: 'Fenêtre de contexte', def: 'Nombre maximal de tokens qu\'un LLM peut traiter en une seule fois (entrée + sortie). GPT-4 Turbo : 128k, Claude 3.5 : 200k.' },
  'fenêtre de contexte':  { fr: 'Fenêtre de contexte', def: 'Nombre maximal de tokens qu\'un LLM peut traiter en une seule fois. Limite la longueur des conversations et des documents analysables.' },

  // Architectures
  'cnn':                  { fr: 'CNN (Réseau Convolutif)', def: 'Architecture idéale pour les images : utilise des filtres coulissants pour détecter des features locales (bords, textures, formes).' },
  'rnn':                  { fr: 'RNN (Réseau Récurrent)', def: 'Traite des séquences en maintenant un état caché. Remplacé par les Transformers pour la plupart des tâches NLP.' },
  'lstm':                 { fr: 'LSTM', def: 'Long Short-Term Memory — variant du RNN avec une mémoire à long terme explicite pour éviter le problème du gradient qui disparaît.' },

  // Entraînement
  'epoch':                { fr: 'Epoch', def: 'Un passage complet sur l\'ensemble du dataset d\'entraînement. Plusieurs epochs sont nécessaires pour converger.' },
  'batch':                { fr: 'Batch', def: 'Sous-ensemble des données utilisé pour calculer le gradient avant chaque mise à jour des poids.' },
  'loss function':        { fr: 'Fonction de perte', def: 'Mesure l\'écart entre la prédiction du modèle et la valeur réelle. L\'objectif est de minimiser cette valeur durant l\'entraînement.' },
  'fonction de perte':    { fr: 'Fonction de perte', def: 'Mesure l\'écart entre la prédiction du modèle et la valeur réelle. L\'objectif est de minimiser cette valeur durant l\'entraînement.' },

  // Agents / MCP
  'agent':                { fr: 'Agent IA', def: 'Programme autonome qui perçoit son environnement, planifie et exécute des actions (appels d\'outils, recherches...) pour atteindre un objectif.' },
  'mcp':                  { fr: 'MCP (Model Context Protocol)', def: 'Protocole open-source d\'Anthropic permettant aux LLMs de se connecter à des outils et sources de données externes de façon standardisée.' },
  'tool use':             { fr: 'Tool Use / Function Calling', def: 'Capacité d\'un LLM à appeler des fonctions externes (APIs, recherches, calculs) intégrées dans son contexte de réponse.' },
  'temperature':          { fr: 'Température', def: 'Paramètre contrôlant le degré de créativité du LLM. 0 = déterministe, 1+ = plus aléatoire et créatif.' },

  // ── Termes métier (dans les exemples de code) ────────────────────────────────
  'sku':                  { fr: 'SKU (Stock Keeping Unit)', def: 'Référence produit unique permettant d\'identifier précisément un article en stock. Exemple : "SHIRT-L-RED" pour une chemise taille L rouge.' },
  'churner':              { fr: 'Churner', def: 'Client qui a résilié ou cessé d\'utiliser un service. Le taux de churn mesure le % de clients perdus sur une période donnée.' },
  'churn':                { fr: 'Churn (attrition)', def: 'Perte de clients ou d\'abonnés. Un modèle de prédiction de churn identifie les clients à risque avant qu\'ils ne partent.' },
  'roi':                  { fr: 'ROI (Return On Investment)', def: 'Retour sur investissement : (gains − coût) / coût × 100. En IA, mesure la valeur générée par un modèle par rapport à son coût de développement.' },
  'kpi':                  { fr: 'KPI (Key Performance Indicator)', def: 'Indicateur clé de performance. En ML : accuracy, F1-score, latence... En business : churn rate, CA, NPS...' },
  'crm':                  { fr: 'CRM (Customer Relationship Management)', def: 'Logiciel de gestion de la relation client (Salesforce, HubSpot...). Source fréquente de données pour les modèles de prédiction.' },
  'erp':                  { fr: 'ERP (Enterprise Resource Planning)', def: 'Progiciel de gestion intégré (SAP, Oracle...) centralisant les données d\'entreprise : stocks, commandes, RH. Source de données structurées pour l\'IA.' },
  'api':                  { fr: 'API (Application Programming Interface)', def: 'Interface permettant à deux programmes de communiquer. En IA : exposer un modèle via une API REST permet à n\'importe quelle appli de l\'utiliser.' },
  'sla':                  { fr: 'SLA (Service Level Agreement)', def: 'Accord de niveau de service définissant des engagements mesurables : disponibilité (99,9%), latence maximale (< 200 ms), etc.' },
  'poc':                  { fr: 'POC (Proof of Concept)', def: 'Preuve de concept : prototype rapide pour valider la faisabilité d\'une idée avant de l\'industrialiser. Étape courante avant un projet IA en prod.' },
  'ctr':                  { fr: 'CTR (Click-Through Rate)', def: 'Taux de clic : nombre de clics / nombre d\'impressions. Métrique clé pour les systèmes de recommandation et publicité.' },
  'cac':                  { fr: 'CAC (Customer Acquisition Cost)', def: 'Coût d\'acquisition client : budget marketing / nombre de nouveaux clients. L\'IA peut optimiser les campagnes pour réduire le CAC.' },
  'mrr':                  { fr: 'MRR (Monthly Recurring Revenue)', def: 'Revenus récurrents mensuels. Métrique SaaS clé. Les modèles de prédiction de churn visent à protéger le MRR.' },
  'ltv':                  { fr: 'LTV (Lifetime Value)', def: 'Valeur totale générée par un client sur toute la durée de sa relation. L\'IA permet de prédire le LTV pour prioriser les actions commerciales.' },

  // ── Fonctions d'activation ───────────────────────────────────────────────────
  'relu':                 { fr: 'ReLU (Rectified Linear Unit)', def: 'Fonction d\'activation : max(0, x). Très utilisée dans les réseaux profonds car elle évite le problème du gradient qui disparaît et est rapide à calculer.' },
  'sigmoid':              { fr: 'Sigmoid (sigmoïde)', def: 'Fonction d\'activation : 1 / (1 + e⁻ˣ). Transforme n\'importe quelle valeur en probabilité entre 0 et 1. Utilisée pour la classification binaire.' },
  'softmax':              { fr: 'Softmax', def: 'Convertit un vecteur de scores en distribution de probabilités dont la somme vaut 1. Utilisé en sortie des réseaux de classification multi-classes et des LLMs.' },
  'tanh':                 { fr: 'Tanh (tangente hyperbolique)', def: 'Fonction d\'activation variant de -1 à +1. Utilisée dans les LSTMs et RNNs pour modéliser des signaux centrés autour de zéro.' },

  // ── Métriques d'évaluation ───────────────────────────────────────────────────
  'accuracy':             { fr: 'Accuracy (exactitude)', def: 'Proportion de prédictions correctes : (TP + TN) / total. Trompeuse sur des datasets déséquilibrés — préférer le F1-score.' },
  'precision':            { fr: 'Précision (Precision)', def: 'Parmi les éléments prédits positifs, combien le sont vraiment : TP / (TP + FP). Importante quand les faux positifs sont coûteux.' },
  'recall':               { fr: 'Rappel (Recall)', def: 'Parmi tous les vrais positifs, combien ont été détectés : TP / (TP + FN). Importante quand les faux négatifs sont coûteux (ex: détection maladie).' },
  'f1':                   { fr: 'F1-score', def: 'Moyenne harmonique de la précision et du rappel : 2 × (P × R) / (P + R). Bon indicateur sur les datasets déséquilibrés.' },
  'f1-score':             { fr: 'F1-score', def: 'Moyenne harmonique de la précision et du rappel. Équilibre entre ne pas rater de vrais positifs et ne pas générer trop de faux positifs.' },
  'auc':                  { fr: 'AUC (Area Under Curve)', def: 'Surface sous la courbe ROC. Varie de 0 à 1 — un modèle parfait a AUC = 1, un modèle aléatoire AUC = 0.5. Indépendant du seuil de décision.' },
  'roc':                  { fr: 'Courbe ROC', def: 'Receiver Operating Characteristic — trace le taux de vrais positifs vs faux positifs pour différents seuils. La diagonale représente un modèle aléatoire.' },
  'auc-roc':              { fr: 'AUC-ROC', def: 'Métrique combinant la courbe ROC et la surface sous cette courbe. Mesure la capacité d\'un classifieur à distinguer les classes indépendamment du seuil.' },
  'mae':                  { fr: 'MAE (Mean Absolute Error)', def: 'Erreur absolue moyenne : moyenne des |prédiction − réalité|. Robuste aux outliers, facile à interpréter dans l\'unité originale.' },
  'mse':                  { fr: 'MSE (Mean Squared Error)', def: 'Erreur quadratique moyenne : moyenne des (prédiction − réalité)². Pénalise davantage les grosses erreurs. C\'est souvent la loss de régression.' },
  'rmse':                 { fr: 'RMSE (Root Mean Squared Error)', def: 'Racine carrée du MSE. Exprime l\'erreur dans la même unité que la variable cible, plus interprétable que le MSE brut.' },
  'cross-validation':     { fr: 'Validation croisée', def: 'Technique d\'évaluation : découpe les données en K plis, entraîne K fois en alternant le pli de test. Donne une estimation fiable de la performance réelle.' },
  'confusion matrix':     { fr: 'Matrice de confusion', def: 'Tableau récapitulant TP (vrais positifs), TN, FP, FN. Visualise les types d\'erreurs d\'un classifieur.' },
  'data drift':           { fr: 'Data Drift', def: 'Changement de la distribution des données en production par rapport aux données d\'entraînement. Provoque une dégradation silencieuse des performances du modèle.' },

  // ── Modèles et techniques ────────────────────────────────────────────────────
  'bert':                 { fr: 'BERT', def: 'Bidirectional Encoder Representations from Transformers (Google, 2018). Modèle de compréhension du langage pré-entraîné en lisant le texte dans les deux sens.' },
  'gpt':                  { fr: 'GPT', def: 'Generative Pre-trained Transformer (OpenAI). Architecture auto-régressive entraînée à prédire le token suivant. Base de ChatGPT et de nombreux LLMs.' },
  'lora':                 { fr: 'LoRA (Low-Rank Adaptation)', def: 'Technique de fine-tuning efficace : au lieu de modifier tous les poids, on ajoute de petites matrices de rang faible. Réduit la mémoire nécessaire de 10×.' },
  'rlhf':                 { fr: 'RLHF (Reinforcement Learning from Human Feedback)', def: 'Technique d\'alignement : des humains notent des réponses du modèle, un modèle de récompense est entraîné, puis le LLM est optimisé via RL.' },
  'bpe':                  { fr: 'BPE (Byte Pair Encoding)', def: 'Algorithme de tokenisation qui fusionne itérativement les paires de caractères les plus fréquentes. Utilisé par GPT, Llama, Mistral...' },
  'tokenizer':            { fr: 'Tokenizer (tokeniseur)', def: 'Composant qui découpe le texte en tokens avant de les passer au modèle. Chaque LLM a son propre tokenizer avec son vocabulaire.' },
  'hnsw':                 { fr: 'HNSW (Hierarchical Navigable Small World)', def: 'Algorithme de recherche approximative de voisins les plus proches en haute dimension. Très rapide pour les bases vectorielles (utilisé par Chroma, Qdrant...).' },
  'faiss':                { fr: 'FAISS', def: 'Bibliothèque Meta pour la recherche de similarité vectorielle à grande échelle. Optimisée GPU pour des milliards de vecteurs.' },
  'cosine':               { fr: 'Similarité cosinus', def: 'Mesure l\'angle entre deux vecteurs (indépendamment de leur norme). Score de 1 = même direction = très similaires. Utilisée pour comparer des embeddings.' },
  'feature engineering':  { fr: 'Feature Engineering', def: 'Création et transformation de variables d\'entrée pour améliorer un modèle ML. Exemple : extraire le jour de la semaine d\'une date.' },
  'mlops':                { fr: 'MLOps', def: 'Pratiques DevOps appliquées au ML : automatisation des pipelines d\'entraînement, monitoring des modèles en prod, versionning des données et modèles.' },

  // ── Architectures & algorithmes supplémentaires ──────────────────────────────
  'mlp':                  { fr: 'MLP (Perceptron Multi-Couche)', def: 'Réseau de neurones entièrement connecté (fully-connected). Composé d\'une couche d\'entrée, de couches cachées et d\'une couche de sortie.' },
  'perceptron':           { fr: 'Perceptron', def: 'Neurone artificiel élémentaire : calcule une somme pondérée de ses entrées et applique une fonction d\'activation. Brique de base de tous les réseaux de neurones.' },
  'svd':                  { fr: 'SVD (Décomposition en Valeurs Singulières)', def: 'Factorisation d\'une matrice en trois matrices. Utilisée pour la réduction de dimension, la détection de topics latents et les systèmes de recommandation.' },
  'sgd':                  { fr: 'SGD (Descente de Gradient Stochastique)', def: 'Variante de la descente de gradient qui met à jour les poids après chaque exemple (ou mini-batch). Plus rapide mais plus bruité que le GD classique.' },
  'dbscan':               { fr: 'DBSCAN', def: 'Algorithme de clustering basé sur la densité. Détecte des clusters de formes arbitraires et identifie automatiquement les points aberrants (outliers), sans spécifier K à l\'avance.' },
  'sft':                  { fr: 'SFT (Supervised Fine-Tuning)', def: 'Première phase d\'alignement des LLMs : on les entraîne supervisément sur des exemples de conversations de haute qualité rédigés par des humains.' },
  'ppo':                  { fr: 'PPO (Proximal Policy Optimization)', def: 'Algorithme de Reinforcement Learning utilisé dans RLHF pour aligner les LLMs. Il optimise le modèle selon un signal de récompense tout en évitant des changements trop brusques.' },
  'bge':                  { fr: 'BGE (BAAI General Embedding)', def: 'Famille de modèles d\'embedding open-source performants de l\'Institut BAAI. Couramment utilisés comme encodeur dans les pipelines RAG.' },
  'ivf':                  { fr: 'IVF (Inverted File Index)', def: 'Structure d\'index pour la recherche vectorielle approximative. Regroupe les vecteurs en clusters pour éviter de comparer avec toute la base à chaque requête.' },

  // ── Développement & infrastructure ───────────────────────────────────────────
  'sdk':                  { fr: 'SDK (Software Development Kit)', def: 'Kit de développement logiciel — ensemble de bibliothèques, outils et documentation pour intégrer facilement un service dans son code.' },
  'jwt':                  { fr: 'JWT (JSON Web Token)', def: 'Format de token d\'authentification signé, auto-porteur : contient l\'identité de l\'utilisateur sans nécessiter de requête en base. Standard des APIs sécurisées.' },
  'crud':                 { fr: 'CRUD', def: 'Create, Read, Update, Delete — les quatre opérations fondamentales d\'une base de données ou d\'une API REST. Base de tout système de gestion de données.' },

  // ── Infrastructure ───────────────────────────────────────────────────────────
  'gpu':                  { fr: 'GPU (Graphics Processing Unit)', def: 'Processeur graphique massivement parallèle, indispensable pour entraîner des réseaux de neurones. Un GPU peut effectuer des milliers d\'opérations simultanées.' },
  'vram':                 { fr: 'VRAM (Video RAM)', def: 'Mémoire embarquée sur le GPU. Limite la taille des modèles qu\'on peut charger. Un LLM 7B en float16 nécessite ~14 Go de VRAM.' },
  'rest':                 { fr: 'REST (API REST)', def: 'Style d\'architecture d\'API web utilisant HTTP : GET pour lire, POST pour créer, PUT pour modifier, DELETE pour supprimer. Standard pour exposer un modèle IA.' },
  'json':                 { fr: 'JSON', def: 'JavaScript Object Notation — format texte léger pour échanger des données. Standard de facto pour les APIs REST et les fichiers de configuration.' },
  'docker':               { fr: 'Docker', def: 'Outil de conteneurisation : emballe une appli et toutes ses dépendances dans un conteneur portable et reproductible. Utilisé pour déployer des modèles IA.' },
  'http':                 { fr: 'HTTP / HTTPS', def: 'Protocole de communication du web. HTTPS est sa version sécurisée (chiffrée). Base des APIs REST utilisées pour interroger les LLMs en production.' },

  // ── Réseaux de neurones — concepts clés ─────────────────────────────────────
  'vanishing gradient':   { fr: 'Gradient qui disparaît', def: 'Problème des réseaux profonds : lors de la rétropropagation, les gradients se multiplient par des petits nombres et deviennent exponentiellement proches de zéro dans les premières couches, bloquant l\'apprentissage. ReLU et les LSTMs ont été conçus pour l\'atténuer.' },
  'gru':                  { fr: 'GRU (Gated Recurrent Unit)', def: 'Variante simplifiée du LSTM avec seulement deux portes (mise à jour, réinitialisation). Moins de paramètres que le LSTM, souvent aussi performante. Choix courant pour les séries temporelles.' },
  'gelu':                 { fr: 'GELU (Gaussian Error Linear Unit)', def: 'Fonction d\'activation lissée utilisée dans BERT, GPT et la majorité des LLMs modernes. Légèrement supérieure à ReLU sur les tâches NLP.' },
  'encoder':              { fr: 'Encodeur (Encoder)', def: 'Partie du Transformer qui lit la séquence dans les deux sens et produit une représentation vectorielle du texte. BERT est un modèle encodeur — idéal pour comprendre le texte.' },
  'decoder':              { fr: 'Décodeur (Decoder)', def: 'Partie du Transformer qui génère du texte token par token en ne regardant que les tokens passés (causal masking). GPT est un modèle décodeur — idéal pour générer du texte.' },
  'convolution':          { fr: 'Convolution', def: 'Opération mathématique qui fait glisser un filtre (kernel) sur une image pour détecter des patterns locaux : bords, textures, formes. Brique de base des CNN.' },
  'pooling':              { fr: 'Pooling', def: 'Couche de sous-échantillonnage dans un CNN qui réduit la taille spatiale. Max pooling retient la valeur maximale dans chaque fenêtre, réduisant la résolution et augmentant la robustesse aux translations.' },

  // ── Types d'apprentissage ────────────────────────────────────────────────────
  'supervised learning':          { fr: 'Apprentissage supervisé', def: 'Le modèle apprend à partir de données étiquetées (entrée → sortie connue). Ex: prédire le prix d\'une maison depuis ses caractéristiques. Représente ~80% des cas en production.' },
  'unsupervised learning':        { fr: 'Apprentissage non supervisé', def: 'Le modèle découvre des structures cachées dans des données non étiquetées. Ex: regrouper des clients par comportement (clustering). Utile quand annoter des données est coûteux.' },
  'reinforcement learning':       { fr: 'Apprentissage par renforcement', def: 'Un agent prend des actions dans un environnement et reçoit des récompenses ou pénalités. Il apprend par essai-erreur à maximiser la récompense cumulée. Utilisé pour les jeux, la robotique et le fine-tuning des LLMs (RLHF).' },

  // ── Algorithmes ML classiques ────────────────────────────────────────────────
  'random forest':        { fr: 'Forêt Aléatoire (Random Forest)', def: 'Ensemble de centaines d\'arbres de décision entraînés sur des sous-échantillons aléatoires. Chaque arbre vote et on prend la majorité. Très robuste, peu sensible au surapprentissage.' },
  'gradient boosting':    { fr: 'Gradient Boosting', def: 'Technique d\'ensemble qui entraîne des arbres de décision en séquence, chaque nouvel arbre corrigeant les erreurs du précédent. XGBoost et LightGBM en sont les implémentations les plus performantes.' },
  'xgboost':              { fr: 'XGBoost', def: 'Implémentation optimisée du gradient boosting, très populaire en compétitions ML et production. Rapide, efficace sur les données tabulaires, gère les valeurs manquantes automatiquement.' },
  'word2vec':             { fr: 'Word2Vec', def: 'Modèle d\'embedding entraîné à prédire le contexte d\'un mot (Skip-gram) ou un mot depuis son contexte (CBOW). A démontré que les mots similaires ont des représentations vectorielles proches. Précurseur des embeddings modernes.' },

  // ── Optimiseurs ──────────────────────────────────────────────────────────────
  'adam':                 { fr: 'Adam (Adaptive Moment Estimation)', def: 'Optimiseur combinant momentum (direction moyenne) et RMSprop (adaptation du learning rate). Le choix par défaut pour entraîner des réseaux de neurones. Converge plus vite que la descente de gradient classique.' },
  'adamw':                { fr: 'AdamW', def: 'Variante d\'Adam avec weight decay découplé. Meilleure généralisation que Adam. Optimiseur standard pour fine-tuner les LLMs (GPT, BERT, LLaMA utilisent tous AdamW).' },
  'momentum':             { fr: 'Momentum', def: 'Technique d\'optimisation qui accumule les gradients passés pour maintenir une direction dans la descente. Accélère la convergence et atténue les oscillations dans les "vallées" de la fonction de perte.' },

  // ── Frameworks ───────────────────────────────────────────────────────────────
  'pytorch':              { fr: 'PyTorch', def: 'Framework deep learning open-source de Meta. Le standard dans la recherche IA. Graphe de calcul dynamique, débug facile. Utilisé pour entraîner la grande majorité des LLMs modernes.' },
  'tensorflow':           { fr: 'TensorFlow', def: 'Framework deep learning de Google. Populaire en production grâce à TensorFlow Serving et TFLite (mobile). Keras est son API haut niveau.' },

  // ── État de l'art 2024-2025 ──────────────────────────────────────────────────
  'multimodal':           { fr: 'Multimodal', def: 'Modèle capable de traiter plusieurs types de données en entrée : texte, images, audio, vidéo. GPT-4o, Claude 3.5, Gemini 1.5 sont des modèles multimodaux natifs.' },
  'reasoning model':      { fr: 'Modèle de raisonnement', def: 'LLM qui "pense" avant de répondre via une chaîne de réflexion interne invisible. o1, o3 (OpenAI), DeepSeek-R1 : bien supérieurs sur les maths, la programmation et la logique complexe.' },
  'edge ai':              { fr: 'Edge AI', def: 'Exécution de modèles d\'IA directement sur l\'appareil (téléphone, laptop) sans appel à un serveur cloud. Avantages : confidentialité, latence nulle, pas de coût API. Ex: Llama 3.2 sur iPhone.' },
  'langchain':            { fr: 'LangChain', def: 'Framework Python/JavaScript d\'orchestration de LLMs. Chaînes de traitement, intégrations avec des dizaines d\'outils et modèles. Le plus populaire mais verbeux. LangGraph pour les workflows complexes.' },
  'llamaindex':           { fr: 'LlamaIndex', def: 'Framework Python spécialisé dans l\'indexation et la recherche de documents pour les pipelines RAG. Excellent pour traiter des documents complexes (PDF, tables, images).' },
  'seq2seq':              { fr: 'Seq2Seq (Séquence à Séquence)', def: 'Architecture composée d\'un encodeur qui compresse la séquence d\'entrée et d\'un décodeur qui génère la séquence de sortie. Base de la traduction automatique avant les Transformers.' },
}

// Lookup case-insensitive
function lookupTerm(text) {
  const lower = text.toLowerCase().trim()
  return GLOSSARY[lower] || null
}

// ── Tooltip component ─────────────────────────────────────────────────────────
export function GlossaryTooltip({ term, children }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: true })
  const ref = useRef(null)

  useEffect(() => {
    if (!open || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setPos({ top: rect.top > 160 })
  }, [open])

  const entry = lookupTerm(term)
  if (!entry) return <>{children}</>

  return (
    <span
      ref={ref}
      style={{ position: 'relative', display: 'inline' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span style={{
        borderBottom: '1px dashed rgba(129,140,248,0.6)',
        color: 'var(--color-primary-light)',
        cursor: 'help',
        textDecorationSkipInk: 'none',
      }}>
        {children}
      </span>

      {open && (
        <span style={{
          position: 'absolute',
          [pos.top ? 'bottom' : 'top']: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 500,
          width: 260,
          background: 'rgba(10, 14, 30, 0.98)',
          border: '1px solid rgba(99,102,241,0.35)',
          borderRadius: 10,
          padding: '10px 13px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(99,102,241,0.15)',
          backdropFilter: 'blur(16px)',
          display: 'block',
          animation: 'tooltipIn 0.15s ease',
          pointerEvents: 'none',
        }}>
          <style>{`
            @keyframes tooltipIn {
              from { opacity:0; transform:translateX(-50%) translateY(4px); }
              to   { opacity:1; transform:translateX(-50%) translateY(0); }
            }
          `}</style>
          {/* Caret */}
          <span style={{
            position: 'absolute',
            [pos.top ? 'bottom' : 'top']: -5,
            left: '50%',
            transform: pos.top ? 'translateX(-50%) rotate(-45deg)' : 'translateX(-50%) rotate(135deg)',
            width: 8, height: 8,
            background: 'rgba(10,14,30,0.98)',
            border: `1px solid rgba(99,102,241,0.35)`,
            borderRight: 'none', borderTop: 'none',
          }} />
          <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#818cf8', marginBottom: 5, letterSpacing: '0.02em' }}>
            📖 {entry.fr}
          </span>
          <span style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.55 }}>
            {entry.def}
          </span>
        </span>
      )}
    </span>
  )
}

// ── Parse markdown into typed segments ───────────────────────────────────────
function parseMarkdown(text) {
  const segments = []
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g
  let lastIndex = 0
  let match
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', text: text.slice(lastIndex, match.index) })
    }
    const raw = match[0]
    if (raw.startsWith('**')) {
      segments.push({ type: 'bold', text: raw.slice(2, -2) })
    } else if (raw.startsWith('`')) {
      segments.push({ type: 'code', text: raw.slice(1, -1) })
    } else {
      segments.push({ type: 'italic', text: raw.slice(1, -1) })
    }
    lastIndex = match.index + raw.length
  }
  if (lastIndex < text.length) {
    segments.push({ type: 'text', text: text.slice(lastIndex) })
  }
  return segments
}

// ── Annotate a plain-text string with glossary tooltips ──────────────────────
const SORTED_TERMS = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length)

function annotateGlossary(text, baseKey) {
  const nodes = []
  let remaining = text
  let key = baseKey * 10000

  while (remaining.length > 0) {
    let foundAt = -1
    let foundTerm = null

    for (const term of SORTED_TERMS) {
      const idx = remaining.toLowerCase().indexOf(term)
      if (idx === -1) continue
      // Ensure it's a word boundary (not inside a larger word)
      const before = idx === 0 ? '' : remaining[idx - 1]
      const after = remaining[idx + term.length] ?? ''
      const wordChar = /\w/
      if (wordChar.test(before) || wordChar.test(after)) continue
      if (foundAt === -1 || idx < foundAt) {
        foundAt = idx
        foundTerm = term
      }
    }

    if (foundAt === -1 || !foundTerm) {
      nodes.push(<span key={key++}>{remaining}</span>)
      break
    }

    if (foundAt > 0) {
      nodes.push(<span key={key++}>{remaining.slice(0, foundAt)}</span>)
    }

    const originalText = remaining.slice(foundAt, foundAt + foundTerm.length)
    nodes.push(
      <GlossaryTooltip key={key++} term={foundTerm}>
        {originalText}
      </GlossaryTooltip>
    )
    remaining = remaining.slice(foundAt + foundTerm.length)
  }
  return nodes
}

// ── AutoTooltipText: renders markdown + glossary tooltips ────────────────────
export function AutoTooltipText({ text, style, tag: Tag = 'span' }) {
  if (!text) return null

  const mdSegments = parseMarkdown(text)
  const nodes = []
  let key = 0

  for (const seg of mdSegments) {
    if (seg.type === 'code') {
      nodes.push(<code key={key++}>{seg.text}</code>)
    } else if (seg.type === 'bold') {
      nodes.push(
        <strong key={key++} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
          {annotateGlossary(seg.text, key)}
        </strong>
      )
    } else if (seg.type === 'italic') {
      nodes.push(<em key={key++}>{seg.text}</em>)
    } else {
      nodes.push(...annotateGlossary(seg.text, key))
    }
    key++
  }

  return <Tag style={style}>{nodes}</Tag>
}
