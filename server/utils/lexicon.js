export const manipulationLexicon = {
  fear_mongering: {
    weight: 1.5,
    terms: [
      'disaster','catastrophe','crisis','deadly','terrifying','devastating','collapse',
      'apocalypse','doom','fatal','alarming','disturbing','nightmare','chaos','panic',
      'outbreak','epidemic','invasion','massacre','extinction','terror','imminent danger',
      'life-threatening','no one is safe','the end is near','putting lives at risk',
    ],
  },
  urgency_pressure: {
    weight: 1.3,
    terms: [
      'act now','immediately','urgent','last chance','limited time','before it\'s too late',
      'hurry','right now','no time to lose','deadline','running out','final warning',
      'time is running out','you must act immediately','don\'t wait','expires soon',
    ],
  },
  exaggeration: {
    weight: 1.2,
    terms: [
      'always','never','everyone knows','nobody believes','every single','absolutely certain',
      'completely wrong','worst ever','best ever','unprecedented','unbelievable','miraculous',
      'revolutionary','mind-blowing','beyond all doubt','undeniable proof','100%','without exception',
    ],
  },
  authority_misuse: {
    weight: 1.4,
    terms: [
      'experts say','scientists confirm','studies show','research proves','doctors warn',
      'officials admit','insiders reveal','sources say','classified','leaked document',
      'whistleblower','anonymous source','they don\'t want you to know','hidden truth',
      'mainstream media won\'t tell you','secret report',
    ],
  },
  polarization: {
    weight: 1.3,
    terms: [
      'us vs them','patriots','traitors','enemies','corrupt elite','deep state','sheeple',
      'real people','awakened','globalists','radical extremist','communist','puppet','brainwashed',
      'either with us or against us','wake up people','the real enemy','they are destroying',
    ],
  },
  emotional_manipulation: {
    weight: 1.2,
    terms: [
      'heartbreaking','outrageous','infuriating','disgusting','shameful','despicable',
      'unforgivable','horrific','betrayal','victim','agony','despair','helpless',
      'how can you not be angry','only a monster would','think of the children',
      'if you care about','as a decent human being','this should make you furious',
    ],
  },
};

export const categoryKeys = Object.keys(manipulationLexicon);
