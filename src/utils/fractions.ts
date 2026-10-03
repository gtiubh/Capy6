/**
 * Fraction helper functions and curriculum exercise generator for 6th grade Gymnasien
 */

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

export function lcm(a: number, b: number): number {
  return (Math.abs(a * b)) / gcd(a, b);
}

export function simplifyFraction(num: number, den: number): { num: number; den: number } {
  if (den === 0) return { num: 0, den: 1 };
  const divisor = gcd(num, den);
  return {
    num: num / divisor,
    den: den / divisor,
  };
}

export function areFractionsEqual(n1: number, d1: number, n2: number, d2: number): boolean {
  return n1 * d2 === n2 * d1;
}

export function fractionToDecimal(num: number, den: number): number {
  return den === 0 ? 0 : num / den;
}

/**
 * Generate a random integer between min and max inclusive
 */
export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Pick random item from an array
 */
export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Shuffle an array immutably
 */
export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

import { QuestionData, TopicId } from '../types/game';

export function generateQuestion(topicId: TopicId): QuestionData {
  switch (topicId) {
    case 'anteile':
      return generateAnteilQuestion();
    case 'erweitern_kuerzen':
      return generateErweiternKuerzenQuestion();
    case 'vergleichen':
      return generateVergleichenQuestion();
    case 'zahlenstrahl':
      return generateZahlenstrahlQuestion();
    case 'gemischte_zahlen':
      return generateGemischteZahlenQuestion();
  }
}

// 1. Anteile eines Ganzen
function generateAnteilQuestion(): QuestionData {
  const mode = Math.random() > 0.45 ? 'pie_identify' : 'pie_paint';
  const denominators = [3, 4, 5, 6, 8, 10, 12];
  const den = pickRandom(denominators);
  const num = randInt(1, den - 1);

  if (mode === 'pie_paint') {
    return {
      id: 'anteil_' + Math.random().toString(36).substring(2, 9),
      topicId: 'anteile',
      type: 'pie_paint',
      prompt: `Färbe genau ${num}/${den} des Ganzen für das hungrige Capybara ein!`,
      hint: `Das Ganze ist in ${den} gleich große Stücke geteilt. Klicke auf ${num} Stücke, um sie zu markieren.`,
      explanation: `Der Nenner ${den} gibt an, in wie viele gleich große Teile das Ganze geteilt ist. Der Zähler ${num} gibt an, wie viele dieser Teile gemeint sind.`,
      numerator: num,
      denominator: den,
      divisions: den,
      correctAnswer: num,
    };
  }

  // pie_identify
  const options = shuffle([
    { id: 'opt_correct', label: `${num}/${den}`, value: `${num}/${den}`, num, den },
    { id: 'opt_inv', label: `${den - num}/${den}`, value: `${den - num}/${den}`, num: den - num, den },
    { id: 'opt_flip', label: `${den}/${num}`, value: `${den}/${num}`, num: den, den: num },
    { id: 'opt_wrong', label: `${Math.max(1, num - 1)}/${den}`, value: `${Math.max(1, num - 1)}/${den}`, num: Math.max(1, num - 1), den },
  ]);

  return {
    id: 'anteil_' + Math.random().toString(36).substring(2, 9),
    topicId: 'anteile',
    type: 'pie_identify',
    prompt: 'Welcher Bruch entspricht dem markierten Anteil der Scheibe?',
    hint: 'Zähle zuerst alle Stücke zusammen (Nenner unten). Zähle dann die gefärbten Stücke (Zähler oben).',
    explanation: `Es sind ${num} von insgesamt ${den} gleich großen Stücken gefärbt. Das ergibt den Bruch ${num}/${den}.`,
    numerator: num,
    denominator: den,
    divisions: den,
    coloredCount: num,
    options,
    correctAnswer: `${num}/${den}`,
  };
}

// 2. Erweitern und Kürzen
function generateErweiternKuerzenQuestion(): QuestionData {
  const isErweitern = Math.random() > 0.5;

  if (isErweitern) {
    const baseDen = pickRandom([2, 3, 4, 5, 6, 7, 8]);
    const baseNum = randInt(1, baseDen - 1);
    const factor = pickRandom([2, 3, 4, 5]);
    const expandedNum = baseNum * factor;
    const expandedDen = baseDen * factor;

    const options = shuffle([
      { id: 'opt_c', label: `${expandedNum}/${expandedDen}`, value: `${expandedNum}/${expandedDen}`, num: expandedNum, den: expandedDen },
      { id: 'opt_w1', label: `${expandedNum}/${baseDen}`, value: `${expandedNum}/${baseDen}`, num: expandedNum, den: baseDen },
      { id: 'opt_w2', label: `${baseNum}/${expandedDen}`, value: `${baseNum}/${expandedDen}`, num: baseNum, den: expandedDen },
      { id: 'opt_w3', label: `${expandedNum + 1}/${expandedDen}`, value: `${expandedNum + 1}/${expandedDen}`, num: expandedNum + 1, den: expandedDen },
    ]);

    return {
      id: 'erw_' + Math.random().toString(36).substring(2, 9),
      topicId: 'erweitern_kuerzen',
      type: 'expand_step',
      prompt: `Erweitere den Bruch ${baseNum}/${baseDen} mit der Zahl ${factor}!`,
      hint: `Beim Erweitern multiplizierst du ZÄHLER und NENNER mit derselben Zahl: ${baseNum} · ${factor} und ${baseDen} · ${factor}.`,
      explanation: `Zähler: ${baseNum} · ${factor} = ${expandedNum}. Nenner: ${baseDen} · ${factor} = ${expandedDen}. Der Wert des Bruchs bleibt unverändert!`,
      numerator: baseNum,
      denominator: baseDen,
      factor,
      targetFraction: { num: expandedNum, den: expandedDen },
      options,
      correctAnswer: `${expandedNum}/${expandedDen}`,
    };
  } else {
    // Kürzen
    const factor = pickRandom([2, 3, 4, 5]);
    const simpDen = pickRandom([2, 3, 4, 5, 7]);
    const simpNum = randInt(1, simpDen - 1);
    // ensure simpNum and simpDen are coprime
    const d = gcd(simpNum, simpDen);
    const actualSimpNum = simpNum / d;
    const actualSimpDen = simpDen / d;

    const startNum = actualSimpNum * factor;
    const startDen = actualSimpDen * factor;

    const options = shuffle([
      { id: 'opt_c', label: `${actualSimpNum}/${actualSimpDen}`, value: `${actualSimpNum}/${actualSimpDen}`, num: actualSimpNum, den: actualSimpDen },
      { id: 'opt_w1', label: `${actualSimpNum * 2}/${actualSimpDen * 2}`, value: `${actualSimpNum * 2}/${actualSimpDen * 2}`, num: actualSimpNum * 2, den: actualSimpDen * 2 },
      { id: 'opt_w2', label: `${actualSimpNum}/${startDen}`, value: `${actualSimpNum}/${startDen}`, num: actualSimpNum, den: startDen },
      { id: 'opt_w3', label: `${Math.max(1, actualSimpNum - 1)}/${actualSimpDen}`, value: `${Math.max(1, actualSimpNum - 1)}/${actualSimpDen}`, num: Math.max(1, actualSimpNum - 1), den: actualSimpDen },
    ]);

    return {
      id: 'kuerz_' + Math.random().toString(36).substring(2, 9),
      topicId: 'erweitern_kuerzen',
      type: 'reduce_step',
      prompt: `Kürze den Bruch ${startNum}/${startDen} so weit wie möglich (vollständig kürzen)!`,
      hint: `Suche den größten gemeinsamen Teiler (ggT) von ${startNum} und ${startDen}. Beide lassen sich durch ${factor} teilen.`,
      explanation: `${startNum} ÷ ${factor} = ${actualSimpNum} und ${startDen} ÷ ${factor} = ${actualSimpDen}. Der vollständig gekürzte Bruch lautet ${actualSimpNum}/${actualSimpDen}.`,
      numerator: startNum,
      denominator: startDen,
      factor,
      targetFraction: { num: actualSimpNum, den: actualSimpDen },
      options,
      correctAnswer: `${actualSimpNum}/${actualSimpDen}`,
    };
  }
}

// 3. Brüche vergleichen und ordnen
function generateVergleichenQuestion(): QuestionData {
  const isOrder = Math.random() > 0.6;

  if (isOrder) {
    // 4 fractions to order ascending
    // Use denominators 2, 3, 4, 6, 8, 12 with a common base
    const pool = [
      { num: 1, den: 2 },
      { num: 1, den: 4 },
      { num: 3, den: 4 },
      { num: 1, den: 3 },
      { num: 2, den: 3 },
      { num: 5, den: 6 },
      { num: 1, den: 6 },
      { num: 3, den: 8 },
      { num: 5, den: 8 },
      { num: 7, den: 12 },
    ];
    const selected = shuffle(pool).slice(0, 4);
    // Sort them ascending by decimal value
    const sorted = [...selected].sort((a, b) => (a.num / a.den) - (b.num / b.den));

    return {
      id: 'ord_' + Math.random().toString(36).substring(2, 9),
      topicId: 'vergleichen',
      type: 'order_fractions',
      prompt: 'Ordne die Brüche der Größe nach von klein nach groß (aufsteigend)!',
      hint: 'Tipp: Bringe ungleichnamige Brüche auf denselben Hauptnenner oder vergleiche mit 1/2!',
      explanation: `Reihenfolge: ${sorted.map(s => `${s.num}/${s.den} (${(s.num / s.den).toFixed(2)})`).join(' < ')}.`,
      fractionsToCompare: selected.map((f, i) => ({ ...f, id: `f_${i}_${f.num}_${f.den}` })),
      correctAnswer: sorted.map(s => `${s.num}/${s.den}`).join(','),
    };
  }

  // Compare 2 fractions: pick equal, same denominator, same numerator, or different
  const compareSubtype = pickRandom(['same_den', 'same_num', 'different', 'equivalent']);
  let f1 = { num: 1, den: 2 };
  let f2 = { num: 3, den: 4 };

  if (compareSubtype === 'same_den') {
    const den = pickRandom([5, 7, 8, 9, 11]);
    const n1 = randInt(1, den - 2);
    const n2 = randInt(n1 + 1, den - 1);
    f1 = { num: n1, den };
    f2 = { num: n2, den };
  } else if (compareSubtype === 'same_num') {
    const num = randInt(2, 5);
    const d1 = pickRandom([3, 4, 5, 6]);
    const d2 = pickRandom([7, 8, 9, 10]);
    f1 = { num, den: d1 };
    f2 = { num, den: d2 };
  } else if (compareSubtype === 'equivalent') {
    const baseDen = pickRandom([2, 3, 4, 5]);
    const baseNum = randInt(1, baseDen - 1);
    const factor = pickRandom([2, 3]);
    f1 = { num: baseNum, den: baseDen };
    f2 = { num: baseNum * factor, den: baseDen * factor };
    if (Math.random() > 0.5) {
      const temp = f1; f1 = f2; f2 = temp;
    }
  } else {
    // different
    const pairs = [
      [{ num: 2, den: 3 }, { num: 3, den: 4 }],
      [{ num: 3, den: 5 }, { num: 4, den: 7 }],
      [{ num: 5, den: 6 }, { num: 7, den: 8 }],
      [{ num: 1, den: 3 }, { num: 2, den: 5 }],
      [{ num: 3, den: 8 }, { num: 2, den: 5 }],
    ];
    const pair = pickRandom(pairs);
    f1 = pair[0];
    f2 = pair[1];
    if (Math.random() > 0.5) {
      const temp = f1; f1 = f2; f2 = temp;
    }
  }

  const val1 = f1.num / f1.den;
  const val2 = f2.num / f2.den;
  const correctSign = Math.abs(val1 - val2) < 0.00001 ? '=' : val1 < val2 ? '<' : '>';

  let explanation = '';
  if (f1.den === f2.den) {
    explanation = `Bei gleichem Nenner (${f1.den}) entscheidet der Zähler: Da ${f1.num} ${correctSign} ${f2.num}, ist ${f1.num}/${f1.den} ${correctSign} ${f2.num}/${f2.den}.`;
  } else if (f1.num === f2.num) {
    explanation = `Bei gleichem Zähler (${f1.num}) sind Teile mit kleinerem Nenner größer! Daher ist ${f1.num}/${f1.den} ${correctSign} ${f2.num}/${f2.den}.`;
  } else if (correctSign === '=') {
    explanation = `Beide Brüche haben denselben Wert! Durch Erweitern bzw. Kürzen sieht man: ${f1.num}/${f1.den} = ${f2.num}/${f2.den}.`;
  } else {
    const commonDen = lcm(f1.den, f2.den);
    const cNum1 = (f1.num * commonDen) / f1.den;
    const cNum2 = (f2.num * commonDen) / f2.den;
    explanation = `Hauptnenner ist ${commonDen}: ${f1.num}/${f1.den} = ${cNum1}/${commonDen} und ${f2.num}/${f2.den} = ${cNum2}/${commonDen}. Da ${cNum1} ${correctSign} ${cNum2}, gilt ${f1.num}/${f1.den} ${correctSign} ${f2.num}/${f2.den}.`;
  }

  return {
    id: 'comp_' + Math.random().toString(36).substring(2, 9),
    topicId: 'vergleichen',
    type: 'compare_fractions',
    prompt: `Welches Vergleichszeichen (<, =, >) gehört zwischen ${f1.num}/${f1.den} und ${f2.num}/${f2.den}?`,
    hint: 'Bringe ungleichnamige Brüche gedanklich auf einen gemeinsamen Nenner oder vergleiche mit einer Referenz wie der Hälfte (1/2).',
    explanation,
    fractionsToCompare: [
      { ...f1, id: 'left' },
      { ...f2, id: 'right' },
    ],
    options: [
      { id: 'opt_lt', label: '< (kleiner als)', value: '<' },
      { id: 'opt_eq', label: '= (ist gleich)', value: '=' },
      { id: 'opt_gt', label: '> (größer als)', value: '>' },
    ],
    correctAnswer: correctSign,
  };
}

// 4. Zahlenstrahl
function generateZahlenstrahlQuestion(): QuestionData {
  const isRead = Math.random() > 0.45;
  const ticksPerWhole = pickRandom([4, 5, 6, 8, 10]);
  const rangeMax = pickRandom([1, 2]);
  const totalTicks = ticksPerWhole * rangeMax;
  const tickIndex = randInt(1, totalTicks - 1);

  const num = tickIndex;
  const den = ticksPerWhole;

  if (isRead) {
    // User needs to read the fraction where Capybara is standing
    const sim = simplifyFraction(num, den);
    const options = shuffle([
      { id: 'opt_c', label: `${num}/${den}`, value: `${num}/${den}`, num, den },
      { id: 'opt_w1', label: `${Math.max(1, num - 1)}/${den}`, value: `${Math.max(1, num - 1)}/${den}`, num: Math.max(1, num - 1), den },
      { id: 'opt_w2', label: `${num + 1}/${den}`, value: `${num + 1}/${den}`, num: num + 1, den },
      { id: 'opt_w3', label: `${num}/${den + 2}`, value: `${num}/${den + 2}`, num, den: den + 2 },
    ]);

    return {
      id: 'numl_read_' + Math.random().toString(36).substring(2, 9),
      topicId: 'zahlenstrahl',
      type: 'numberline_read',
      prompt: 'An welchem Bruch steht das Capybara auf dem Zahlenstrahl?',
      hint: `Zähle, in wie viele Abschnitte der Bereich von 0 bis 1 unterteilt ist (Nenner). Zähle dann die Schritte ab 0 bis zum Capybara (Zähler).`,
      explanation: `Von 0 bis 1 gibt es ${ticksPerWhole} gleiche Teilabschnitte. Das Capybara steht bei Schritt ${num}, also bei ${num}/${den}${sim.den !== den ? ` (gekürzt: ${sim.num}/${sim.den})` : ''}.`,
      numberLineMax: rangeMax,
      numberLineTicks: ticksPerWhole,
      numberLineTarget: { num, den },
      options,
      correctAnswer: `${num}/${den}`,
    };
  } else {
    // User must click on the correct tick on the number line
    return {
      id: 'numl_place_' + Math.random().toString(36).substring(2, 9),
      topicId: 'zahlenstrahl',
      type: 'numberline_place',
      prompt: `Platziere das Capybara auf der Position ${num}/${den} am Zahlenstrahl!`,
      hint: `Jeder Strichabstand entspricht 1/${den}. Klicke auf den ${num}. Strich nach der 0.`,
      explanation: `Jeder Zwischenraum hat die Länge 1/${den}. Nach ${num} Schritten erreicht man exakt ${num}/${den}.`,
      numberLineMax: rangeMax,
      numberLineTicks: ticksPerWhole,
      numberLineTarget: { num, den },
      correctAnswer: `${num}/${den}`,
    };
  }
}

// 5. Unechte Brüche und gemischte Zahlen
function generateGemischteZahlenQuestion(): QuestionData {
  const isToMixed = Math.random() > 0.5;
  const den = pickRandom([2, 3, 4, 5, 6, 8]);
  const whole = randInt(1, 4);
  const remainder = randInt(1, den - 1);
  const improperNum = whole * den + remainder;

  if (isToMixed) {
    // e.g. 11/4 -> 2 3/4
    const correctLabel = `${whole} ${remainder}/${den}`;
    const options = shuffle([
      { id: 'opt_c', label: `${whole} ${remainder}/${den}`, value: correctLabel, whole, num: remainder, den },
      { id: 'opt_w1', label: `${whole + 1} ${remainder}/${den}`, value: `${whole + 1} ${remainder}/${den}`, whole: whole + 1, num: remainder, den },
      { id: 'opt_w2', label: `${whole} ${Math.max(1, remainder - 1)}/${den}`, value: `${whole} ${Math.max(1, remainder - 1)}/${den}`, whole, num: Math.max(1, remainder - 1), den },
      { id: 'opt_w3', label: `${whole - 1} ${remainder + den}/${den}`, value: `${whole - 1} ${remainder + den}/${den}`, whole: whole - 1, num: remainder + den, den },
    ]);

    return {
      id: 'gem_to_mixed_' + Math.random().toString(36).substring(2, 9),
      topicId: 'gemischte_zahlen',
      type: 'improper_to_mixed',
      prompt: `Verwandle den unechten Bruch ${improperNum}/${den} in eine gemischte Zahl!`,
      hint: `Rechne mit Rest: Wie oft passt die ${den} ganz in die ${improperNum}? Der Rest bleibt als Zähler über ${den}.`,
      explanation: `${improperNum} ÷ ${den} = ${whole} Rest ${remainder}. Daraus ergibt sich die gemischte Zahl ${whole} ${remainder}/${den}.`,
      numerator: improperNum,
      denominator: den,
      whole,
      targetFraction: { num: remainder, den, whole },
      options,
      correctAnswer: correctLabel,
    };
  } else {
    // e.g. 2 3/4 -> 11/4
    const correctLabel = `${improperNum}/${den}`;
    const options = shuffle([
      { id: 'opt_c', label: `${improperNum}/${den}`, value: correctLabel, num: improperNum, den },
      { id: 'opt_w1', label: `${whole * den}/${den}`, value: `${whole * den}/${den}`, num: whole * den, den },
      { id: 'opt_w2', label: `${improperNum + 1}/${den}`, value: `${improperNum + 1}/${den}`, num: improperNum + 1, den },
      { id: 'opt_w3', label: `${whole + remainder}/${den}`, value: `${whole + remainder}/${den}`, num: whole + remainder, den },
    ]);

    return {
      id: 'gem_to_imp_' + Math.random().toString(36).substring(2, 9),
      topicId: 'gemischte_zahlen',
      type: 'mixed_to_improper',
      prompt: `Verwandle die gemischte Zahl ${whole} ${remainder}/${den} in einen unechten Bruch!`,
      hint: `Multipliziere das Ganze (${whole}) mit dem Nenner (${den}) und addiere den Zähler (${remainder}): (${whole} · ${den} + ${remainder}) / ${den}.`,
      explanation: `Jedes Ganze hat ${den}/${den}. Also ${whole} · ${den} = ${whole * den}. Plus die ${remainder} Reststücke ergibt ${improperNum}/${den}.`,
      whole,
      numerator: remainder,
      denominator: den,
      targetFraction: { num: improperNum, den },
      options,
      correctAnswer: correctLabel,
    };
  }
}
