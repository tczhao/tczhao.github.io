/* Base Rate - whether a number means anything.
 *
 * The forecast book is what stops this being a statistics course. Reading
 * about calibration changes nothing; a Brier score that has not moved in three
 * months is the one signal here that cannot be rationalised away. */
window.SITE = {
  key: 'baserate.v1',
  slug: 'baserate',
  name: 'Base Rate',
  eyebrow: 'Notebook',
  tagline: 'whether a number means anything',

  tracks: [
    { id: 'validity', name: 'Measurement and validity' },
    { id: 'uncertainty', name: 'Uncertainty and intervals' },
    { id: 'baserates', name: 'Base rates and conditionals' },
    { id: 'causal', name: 'Causal structure' },
    { id: 'design', name: 'Study design and identification' },
    { id: 'experiments', name: 'Experiments in production' },
    { id: 'evals', name: 'Evaluating models and judges' },
    { id: 'failures', name: 'How inference goes wrong' },
    { id: 'forecasting', name: 'Forecasting and calibration' }
  ],

  levels: { core: 'Core', applied: 'Applied', advanced: 'Advanced' },

  review: 'leitner',
  intervals: [1, 3, 7, 16, 35],
  forecastBook: true,

  copy: {
    labelIdea: 'The idea',
    labelWhy: 'Why it holds',
    labelFailure: 'How it goes wrong in practice',
    labelExperiment: 'Run this today',
    labelForecast: 'Put a number on it',
    labelReflect: 'Log it',
    tabForecast: 'Forecasts',
    sourcePrefix: 'After',
    reflectPlaceholder: 'The number you got, and whether it survived the check.',
    forecastNote: 'A probability you wrote down before you knew. Brier is mean squared error against the outcome, so lower is better and always saying fifty percent scores exactly 0.25.',
    progressNote: 'Entries logged measures reading. The Brier score measures whether any of it reached your judgement. Watch the second one.'
  },

  /* Plotting paper. Cool neutral stock, a teal that reads as a drawn line,
     and a rust action colour that does not look like an error state. */
  palette: {
    faceDisplay: 'Optima, Candara, "Gill Sans", "Gill Sans MT", "Trebuchet MS", sans-serif',
    light: {
      paper: '#F3F6F6', paperRaised: '#FFFFFF', paperSunk: '#E7EDED',
      gridTint: '#10282C', rule: '#D5DEDE', ruleStrong: '#AFBCBC',
      ink: '#101A1C', inkMuted: '#4E5E61', inkFaint: '#869295',
      accent: '#16636B', accentInk: '#105057', action: '#B04A28',
      solid: '#2F6B4F', shaky: '#8A6A1F'
    },
    dark: {
      paper: '#0D1315', paperRaised: '#141C1E', paperSunk: '#080D0F',
      gridTint: '#96C8CD', rule: '#1F2A2C', ruleStrong: '#334245',
      ink: '#D8E3E4', inkMuted: '#92A2A5', inkFaint: '#647275',
      accent: '#57B6BE', accentInk: '#86D0D6', action: '#DE7F5C',
      solid: '#63B08A', shaky: '#C9A651'
    }
  },

  prompt: {
    intro: 'I am working through an entry on measurement and inference and want to apply it to a real number I have to defend.',
    closing: 'Attack the inference rather than agreeing with it. Name the assumption that would have to hold, and tell me what would falsify it. Be concrete and brief.'
  }
};
