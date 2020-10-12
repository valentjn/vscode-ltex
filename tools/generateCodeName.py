# Copyright (C) 2020 Julian Valentin, LTeX Development Community
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

import argparse
import os
import random
import re



toolsDirPath = os.path.dirname(os.path.abspath(__file__))
ltexPath = os.path.abspath(os.path.join(toolsDirPath, ".."))

suffixes = """
Acceleration
Accumulation
Acquisition
Agitation
Algorithm
Allocation
Alternative
Amalgamation
Amplification
Annihilation
Application
Approximation
Attenuation
Bifurcation
Calculation
Capacitance
Catalyst
Collapse
Collision
Combustion
Complexity
Conclusion
Configuration
Congruence
Conjecture
Constant
Contamination
Contraction
Conundrum
Convergence
Correlation
Decay
Decoupling
Deprivation
Derivation
Deterioration
Determination
Deviation
Diffusion
Diremption
Disassociation
Disintegration
Displacement
Dissection
Dissipation
Dissolution
Duality
Elasticity
Elevation
Emanation
Entanglement
Equivalency
Erosion
Evaporation
Excitation
Expansion
Expedition
Experiment
Experimentation
Extraction
Factor
Fluctuation
Formulation
Fragmentation
Hypothesis
Illumination
Implementation
Implosion
Incursion
Indeterminacy
Insufficiency
Integration
Interruption
Isotope
Malfunction
Manifestation
Manipulation
Materialization
Methodology
Metric
Miniaturization
Minimization
Momentum
Negation
Nomenclature
Obliteration
Observation
Optimization
Oscillation
Paradigm
Paradox
Peculiarity
Permeability
Permutation
Perturbation
Polarization
Postulate
Potential
Proposal
Proposition
Proximity
Ramification
Reaction
Realignment
Recalibration
Recoil
Recurrence
Reflection
Regeneration
Renormalization
Resonance
Resurgence
Revelation
Reverberation
Saturation
Scattering
Schism
Simulation
Solution
Stimulation
Sublimation
Submergence
Substitution
Summation
Synchronicity
Syndrome
Theorem
Thermalization
Topology
Transcendence
Transformation
Transmission
Transmogrification
Triangulation
Turbulence
Valuation
Verification
Vortex
""".strip().splitlines()



def main():
  parser = argparse.ArgumentParser(
      description="Generate a code name for the next release of LTeX")
  parser.add_argument("topic", metavar="TOPIC", help="Main topic of the release")
  args = parser.parse_args()

  with open(os.path.join(ltexPath, "CHANGELOG.md"), "r") as f: changelog = f.read()
  usedSuffixes = re.findall(r"^## .*? \u2014 \u201cThe .* ([A-Za-z]+)\u201d", changelog,
      flags=re.MULTILINE)

  numberOfUsages = {x : 0 for x in suffixes}
  for x in usedSuffixes: numberOfUsages[x] += 1
  suffixes.sort(key=lambda x: numberOfUsages[x])
  minNumberOfUsages = numberOfUsages[suffixes[0]]

  possibleSuffixes = [x for x in suffixes if numberOfUsages[x] == minNumberOfUsages]
  suffix = random.choice(possibleSuffixes)

  print(f"The {args.topic} {suffix}")



if __name__ == "__main__":
  main()
