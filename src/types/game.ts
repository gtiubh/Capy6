export type TopicId = 
  | 'anteile'          // 1. Brüche als Anteile eines Ganzen beschreiben
  | 'erweitern_kuerzen'// 2. Brüche erweitern und kürzen
  | 'vergleichen'      // 3. Brüche vergleichen und ordnen
  | 'zahlenstrahl'     // 4. Brüche am Zahlenstrahl ablesen und eintragen
  | 'gemischte_zahlen';// 5. Unechte Brüche und gemischte Zahlen

export interface TopicInfo {
  id: TopicId;
  title: string;
  shortTitle: string;
  description: string;
  iconName: string;
  badge: string;
}

export type ExerciseType =
  | 'pie_identify'           // Name the fraction shown in a pie/grid
  | 'pie_paint'              // Click to color parts to match a given fraction
  | 'expand_step'            // Fill in factor and new fraction
  | 'reduce_step'            // Simplify fraction to lowest terms
  | 'compare_fractions'      // Pick <, =, or >
  | 'order_fractions'        // Order 4 fractions ascending
  | 'numberline_read'        // What fraction is Capy standing on?
  | 'numberline_place'       // Move Capy to the requested fraction
  | 'improper_to_mixed'      // Convert e.g. 11/4 -> 2 3/4
  | 'mixed_to_improper';     // Convert e.g. 2 3/4 -> 11/4

export interface QuestionData {
  id: string;
  topicId: TopicId;
  type: ExerciseType;
  prompt: string;
  hint: string;
  explanation: string;
  // Fractional components
  numerator?: number;
  denominator?: number;
  whole?: number;
  targetFraction?: { num: number; den: number; whole?: number };
  options?: Array<{ id: string; label: string; value: any; num?: number; den?: number; whole?: number }>;
  correctAnswer: any;
  // Specific parameters
  divisions?: number;
  coloredCount?: number;
  factor?: number;
  fractionsToCompare?: Array<{ num: number; den: number; id: string }>;
  numberLineMax?: number; // 1 or 2
  numberLineTicks?: number; // subdivisions per whole
  numberLineTarget?: { num: number; den: number };
}

export interface AccessoryItem {
  id: string;
  name: string;
  category: 'hat' | 'face' | 'bath';
  cost: number;
  description: string;
  icon: string;
}

export interface PlayerStats {
  yuzuCoins: number;
  stars: number;
  totalCorrect: number;
  streak: number;
  bestStreak: number;
  onsenWarmth: number; // 0 to 100
  unlockedItems: string[];
  equippedHat: string;
  equippedFace: string;
  equippedBath: string;
  topicMastery: Record<TopicId, { completed: number; total: number; stars: number }>;
}
