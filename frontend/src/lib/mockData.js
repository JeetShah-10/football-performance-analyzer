/**
 * Mock data fixtures matching the frozen API contract (docs/api-contract.md).
 * Used for offline UI development while the backend is unavailable.
 */

export const MOCK_HEALTH = {
  status: 'online',
  dataset: 'FBref 2024-2025',
  total_players: 1802,
  version: '1.0.0',
}

export const MOCK_PLAYERS = [
  { player_id: 'bukayo_saka_eng_eng_2001_0', player_name: 'Bukayo Saka', squad: 'Arsenal', league: 'eng Premier League', position: 'FW,MF', position_group: 'Forward', minutes_played: 1729, age: 22, cluster_id: 1, cluster_name: 'Dynamic Winger / Dribbler', pca_x: 5.931, pca_y: 1.004 },
  { player_id: 'virgil_van_dijk_nl_ned_1991_0', player_name: 'Virgil van Dijk', squad: 'Liverpool', league: 'eng Premier League', position: 'DF', position_group: 'Defender', minutes_played: 2520, age: 32, cluster_id: 0, cluster_name: 'Stopper / Defensive Destroyer', pca_x: -2.145, pca_y: -0.532 },
  { player_id: 'jude_bellingham_eng_eng_2003_0', player_name: 'Jude Bellingham', squad: 'Real Madrid', league: 'es La Liga', position: 'MF', position_group: 'Midfielder', minutes_played: 1890, age: 20, cluster_id: 1, cluster_name: 'Box-to-Box Carrier', pca_x: 1.234, pca_y: 2.567 },
  { player_id: 'erling_haaland_no_nor_2000_0', player_name: 'Erling Haaland', squad: 'Manchester City', league: 'eng Premier League', position: 'FW', position_group: 'Forward', minutes_played: 2100, age: 23, cluster_id: 0, cluster_name: 'Clinical Finisher / Poacher', pca_x: -3.401, pca_y: 1.890 },
  { player_id: 'pedri_es_esp_2002_0', player_name: 'Pedri', squad: 'Barcelona', league: 'es La Liga', position: 'MF', position_group: 'Midfielder', minutes_played: 1650, age: 21, cluster_id: 0, cluster_name: 'Deep-Lying Playmaker', pca_x: 0.512, pca_y: -1.203 },
  { player_id: 'william_saliba_fr_fra_2001_0', player_name: 'William Saliba', squad: 'Arsenal', league: 'eng Premier League', position: 'DF', position_group: 'Defender', minutes_played: 2430, age: 22, cluster_id: 1, cluster_name: 'Ball-Playing Defender', pca_x: -1.501, pca_y: 1.102 },
  { player_id: 'vinicius_junior_br_bra_2000_0', player_name: 'Vinícius Júnior', squad: 'Real Madrid', league: 'es La Liga', position: 'FW', position_group: 'Forward', minutes_played: 2010, age: 23, cluster_id: 1, cluster_name: 'Dynamic Winger / Dribbler', pca_x: 6.120, pca_y: 0.830 },
  { player_id: 'rodri_es_esp_1996_0', player_name: 'Rodri', squad: 'Manchester City', league: 'eng Premier League', position: 'MF', position_group: 'Midfielder', minutes_played: 2340, age: 27, cluster_id: 0, cluster_name: 'Deep-Lying Playmaker', pca_x: -0.340, pca_y: -2.110 },
  { player_id: 'lamine_yamal_es_esp_2007_0', player_name: 'Lamine Yamal', squad: 'Barcelona', league: 'es La Liga', position: 'FW', position_group: 'Forward', minutes_played: 1560, age: 16, cluster_id: 1, cluster_name: 'Dynamic Winger / Dribbler', pca_x: 5.410, pca_y: 1.350 },
  { player_id: 'florian_wirtz_de_ger_2003_0', player_name: 'Florian Wirtz', squad: 'Leverkusen', league: 'de Bundesliga', position: 'MF,FW', position_group: 'Midfielder', minutes_played: 1980, age: 20, cluster_id: 1, cluster_name: 'Box-to-Box Carrier', pca_x: 2.301, pca_y: 1.890 },
  { player_id: 'antonio_rudiger_de_ger_1993_0', player_name: 'Antonio Rüdiger', squad: 'Real Madrid', league: 'es La Liga', position: 'DF', position_group: 'Defender', minutes_played: 2250, age: 30, cluster_id: 0, cluster_name: 'Stopper / Defensive Destroyer', pca_x: -2.890, pca_y: -0.670 },
  { player_id: 'rafael_leao_pt_por_1999_0', player_name: 'Rafael Leão', squad: 'AC Milan', league: 'it Serie A', position: 'FW', position_group: 'Forward', minutes_played: 1870, age: 24, cluster_id: 1, cluster_name: 'Dynamic Winger / Dribbler', pca_x: 5.650, pca_y: 0.450 },
  { player_id: 'josko_gvardiol_hr_cro_2002_0', player_name: 'Joško Gvardiol', squad: 'Manchester City', league: 'eng Premier League', position: 'DF', position_group: 'Defender', minutes_played: 2100, age: 21, cluster_id: 1, cluster_name: 'Ball-Playing Defender', pca_x: -0.890, pca_y: 1.980 },
  { player_id: 'khvicha_kvaratskhelia_ge_geo_2001_0', player_name: 'Khvicha Kvaratskhelia', squad: 'Napoli', league: 'it Serie A', position: 'FW', position_group: 'Forward', minutes_played: 1650, age: 22, cluster_id: 1, cluster_name: 'Dynamic Winger / Dribbler', pca_x: 5.200, pca_y: 0.920 },
  { player_id: 'marcus_thuram_fr_fra_1997_0', player_name: 'Marcus Thuram', squad: 'Inter Milan', league: 'it Serie A', position: 'FW', position_group: 'Forward', minutes_played: 1920, age: 26, cluster_id: 0, cluster_name: 'Clinical Finisher / Poacher', pca_x: -2.780, pca_y: 2.140 },
]

export const MOCK_PLAYER_DETAIL = {
  player_id: 'bukayo_saka_eng_eng_2001_0',
  player_name: 'Bukayo Saka',
  squad: 'Arsenal',
  league: 'eng Premier League',
  position: 'FW,MF',
  position_group: 'Forward',
  minutes_played: 1729,
  age: 22,
  cluster_id: 1,
  cluster_name: 'Dynamic Winger / Dribbler',
  gmm_probabilities: {
    'Clinical Finisher / Poacher': 0.0,
    'Dynamic Winger / Dribbler': 1.0,
  },
  pca_x: 5.931,
  pca_y: 1.004,
  stats: {
    npxG_per90: { value: 0.312, percentile: 64.5 },
    xAG_per90: { value: 0.396, percentile: 97.6 },
    KP_per90: { value: 3.019, percentile: 98.4 },
    PrgP_per90: { value: 3.644, percentile: 84.3 },
    PrgC_per90: { value: 4.997, percentile: 91.4 },
    Tkl_per90: { value: 1.51, percentile: 79.6 },
    Int_per90: { value: 0.156, percentile: 24.5 },
    Succ_per90: { value: 2.134, percentile: 89.6 },
  },
}

/** Additional detail profiles for comparison/scouting demos */
export const MOCK_PLAYER_DETAILS = {
  bukayo_saka_eng_eng_2001_0: MOCK_PLAYER_DETAIL,
  virgil_van_dijk_nl_ned_1991_0: {
    player_id: 'virgil_van_dijk_nl_ned_1991_0',
    player_name: 'Virgil van Dijk',
    squad: 'Liverpool',
    league: 'eng Premier League',
    position: 'DF',
    position_group: 'Defender',
    minutes_played: 2520,
    age: 32,
    cluster_id: 0,
    cluster_name: 'Stopper / Defensive Destroyer',
    gmm_probabilities: {
      'Stopper / Defensive Destroyer': 0.9896,
      'Ball-Playing Defender': 0.0102,
      'Attacking Fullback': 0.0002,
    },
    pca_x: -2.145,
    pca_y: -0.532,
    stats: {
      npxG_per90: { value: 0.054, percentile: 18.2 },
      xAG_per90: { value: 0.038, percentile: 12.4 },
      KP_per90: { value: 0.321, percentile: 22.1 },
      PrgP_per90: { value: 3.928, percentile: 72.8 },
      PrgC_per90: { value: 0.857, percentile: 34.0 },
      Tkl_per90: { value: 1.071, percentile: 68.5 },
      Int_per90: { value: 1.286, percentile: 88.2 },
      Succ_per90: { value: 0.214, percentile: 15.3 },
    },
  },
  lamine_yamal_es_esp_2007_0: {
    player_id: 'lamine_yamal_es_esp_2007_0',
    player_name: 'Lamine Yamal',
    squad: 'Barcelona',
    league: 'es La Liga',
    position: 'FW',
    position_group: 'Forward',
    minutes_played: 1560,
    age: 16,
    cluster_id: 1,
    cluster_name: 'Dynamic Winger / Dribbler',
    gmm_probabilities: {
      'Clinical Finisher / Poacher': 0.02,
      'Dynamic Winger / Dribbler': 0.98,
    },
    pca_x: 5.410,
    pca_y: 1.350,
    stats: {
      npxG_per90: { value: 0.276, percentile: 58.3 },
      xAG_per90: { value: 0.412, percentile: 98.1 },
      KP_per90: { value: 3.462, percentile: 99.1 },
      PrgP_per90: { value: 3.269, percentile: 80.2 },
      PrgC_per90: { value: 5.192, percentile: 93.7 },
      Tkl_per90: { value: 0.962, percentile: 54.8 },
      Int_per90: { value: 0.385, percentile: 41.2 },
      Succ_per90: { value: 2.885, percentile: 94.6 },
    },
  },
}

export const MOCK_SIMILAR = [
  { player_id: 'khvicha_kvaratskhelia_ge_geo_2001_0', player_name: 'Khvicha Kvaratskhelia', squad: 'Napoli', league: 'it Serie A', position_group: 'Forward', cluster_name: 'Dynamic Winger / Dribbler', similarity_score: 98.15 },
  { player_id: 'mat_as_soul__ar_arg_2003_0', player_name: 'Matías Soulé', squad: 'Roma', league: 'it Serie A', position_group: 'Forward', cluster_name: 'Dynamic Winger / Dribbler', similarity_score: 96.2 },
  { player_id: 's_vio_br_bra_2004_0', player_name: 'Sávio', squad: 'Manchester City', league: 'eng Premier League', position_group: 'Forward', cluster_name: 'Dynamic Winger / Dribbler', similarity_score: 94.04 },
  { player_id: 'rafael_leao_pt_por_1999_0', player_name: 'Rafael Leão', squad: 'AC Milan', league: 'it Serie A', position_group: 'Forward', cluster_name: 'Dynamic Winger / Dribbler', similarity_score: 93.21 },
  { player_id: 'lamine_yamal_es_esp_2007_0', player_name: 'Lamine Yamal', squad: 'Barcelona', league: 'es La Liga', position_group: 'Forward', cluster_name: 'Dynamic Winger / Dribbler', similarity_score: 92.88 },
]

export const MOCK_SIMILAR_U21 = [
  { player_id: 'lamine_yamal_es_esp_2007_0', player_name: 'Lamine Yamal', squad: 'Barcelona', league: 'es La Liga', position_group: 'Forward', cluster_name: 'Dynamic Winger / Dribbler', similarity_score: 92.88 },
  { player_id: 'mat_as_soul__ar_arg_2003_0', player_name: 'Matías Soulé', squad: 'Roma', league: 'it Serie A', position_group: 'Forward', cluster_name: 'Dynamic Winger / Dribbler', similarity_score: 96.2 },
  { player_id: 's_vio_br_bra_2004_0', player_name: 'Sávio', squad: 'Manchester City', league: 'eng Premier League', position_group: 'Forward', cluster_name: 'Dynamic Winger / Dribbler', similarity_score: 94.04 },
]

export const MOCK_CLUSTERS = {
  Defender: [
    { cluster_id: 0, cluster_name: 'Ball-Playing Defender', description: 'High progressive passing and build-up vision from deep', signature_stats: [{ feature: 'KP_per90', cluster_mean: 1.128, pos_mean: 0.577, z_score_diff: 1.097 }, { feature: 'xAG_per90', cluster_mean: 0.122, pos_mean: 0.059, z_score_diff: 1.046 }, { feature: 'PrgC_per90', cluster_mean: 2.241, pos_mean: 1.274, z_score_diff: 1.006 }] },
    { cluster_id: 1, cluster_name: 'Stopper / Defensive Destroyer', description: 'High tackles, interceptions, and defensive duel volume', signature_stats: [{ feature: 'KP_per90', cluster_mean: 0.295, pos_mean: 0.577, z_score_diff: -0.561 }, { feature: 'xAG_per90', cluster_mean: 0.026, pos_mean: 0.059, z_score_diff: -0.535 }, { feature: 'PrgC_per90', cluster_mean: 0.781, pos_mean: 1.274, z_score_diff: -0.514 }] },
  ],
  Midfielder: [
    { cluster_id: 0, cluster_name: 'Deep-Lying Playmaker', description: 'High key passes, press resistance, and progressive distribution', signature_stats: [{ feature: 'xAG_per90', cluster_mean: 0.179, pos_mean: 0.112, z_score_diff: 0.873 }, { feature: 'KP_per90', cluster_mean: 1.677, pos_mean: 1.141, z_score_diff: 0.86 }, { feature: 'PrgC_per90', cluster_mean: 2.578, pos_mean: 1.665, z_score_diff: 0.852 }] },
    { cluster_id: 1, cluster_name: 'Box-to-Box / Pressing Engine', description: 'High tackles, transition carries, and box arrivals', signature_stats: [{ feature: 'xAG_per90', cluster_mean: 0.071, pos_mean: 0.112, z_score_diff: -0.538 }, { feature: 'KP_per90', cluster_mean: 0.81, pos_mean: 1.141, z_score_diff: -0.53 }, { feature: 'PrgC_per90', cluster_mean: 1.102, pos_mean: 1.665, z_score_diff: -0.526 }] },
  ],
  Forward: [
    { cluster_id: 0, cluster_name: 'Clinical Finisher / Poacher', description: 'High non-penalty expected goals (npxG) and box presence', signature_stats: [{ feature: 'PrgC_per90', cluster_mean: 1.491, pos_mean: 2.486, z_score_diff: -0.598 }, { feature: 'Succ_per90', cluster_mean: 0.712, pos_mean: 1.135, z_score_diff: -0.536 }, { feature: 'KP_per90', cluster_mean: 0.946, pos_mean: 1.252, z_score_diff: -0.509 }] },
    { cluster_id: 1, cluster_name: 'Dynamic Winger / Dribbler', description: 'High successful take-ons and progressive carries in the final third', signature_stats: [{ feature: 'PrgC_per90', cluster_mean: 4.013, pos_mean: 2.486, z_score_diff: 0.917 }, { feature: 'Succ_per90', cluster_mean: 1.783, pos_mean: 1.135, z_score_diff: 0.823 }, { feature: 'KP_per90', cluster_mean: 1.72, pos_mean: 1.252, z_score_diff: 0.781 }] },
  ],
}

export const MOCK_SCOUT_RESPONSE = {
  intent: 'find_by_criteria',
  entities: { position: 'Forward', max_age: 22, league: 'La Liga' },
  result_type: 'player_list',
  data: [
    { player_id: 'lamine_yamal_es_esp_2007_0', player_name: 'Lamine Yamal', squad: 'Barcelona', league: 'es La Liga', position_group: 'Forward', cluster_name: 'Dynamic Winger / Dribbler' },
  ],
  synthesized_response: 'Found 1 player matching criteria (Position: Forward, Max Age: 22, League: La Liga). Lamine Yamal (Barcelona) is classified as a Dynamic Winger / Dribbler archetype.',
}
