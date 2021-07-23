#!/usr/bin/python3

# Copyright (C) 2020 Julian Valentin, LTeX Development Community
#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

import argparse
import pathlib
import random
import re
import sys
from typing import List
import xml.etree.ElementTree as et

sys.path.append(str(pathlib.Path(__file__).parent))
import common



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



def getUsedSuffixes() -> List[str]:
  xmlFilePath = pathlib.Path(common.repoDirPath.joinpath("changelog.xml"))
  document = et.parse(xmlFilePath).getroot()
  releases = document.findall("./{http://maven.apache.org/changes/1.0.0}body"
      "/{http://maven.apache.org/changes/1.0.0}release")
  usedSuffixes = []

  for release in releases:
    if ("description" not in release.attrib) or (release.attrib["date"] == "upcoming"): continue
    regexMatch = re.search(r"The .* ([A-Za-z]+)", release.attrib["description"])
    assert regexMatch is not None
    usedSuffixes.append(regexMatch.group(1))

  return usedSuffixes



def main() -> None:
  parser = argparse.ArgumentParser(
      description="Generate a code name for the next release of LTeX")
  parser.add_argument("topic", metavar="TOPIC", help="Main topic of the release")
  args = parser.parse_args()

  usedSuffixes = getUsedSuffixes()

  numberOfUsages = {x : 0 for x in suffixes}
  for x in usedSuffixes: numberOfUsages[x] += 1
  suffixes.sort(key=lambda x: numberOfUsages[x])
  minNumberOfUsages = numberOfUsages[suffixes[0]]

  possibleSuffixes = [x for x in suffixes if numberOfUsages[x] == minNumberOfUsages]
  suffix = random.choice(possibleSuffixes)

  print(f"The {args.topic} {suffix}")



if __name__ == "__main__":
  main()
