# Theophyllin aptamer switch example


## Introduction
Artificial 5'UTR regions were designed which change their structure upon theophyllin binding to the integrated aptamer structure.
This triggers the opening of a terminator structure allowing to fully transcribe the mRNA.

## Sequenzes
The original sequence can be found in `RS3.fa`, a mutated version in `RS3mut.fa`.

## RNAfold with soft-constraints

```sh
RNAfold < RS3mut.fa
```

include soft constraints which model theophyllin binding
```sh
RNAfold --motif="GAUACCAG&CCCUUGGCAGC,(...((((&)...)))...),-9.22" < RS3mut.fa
```

## Predict ensemble

no switching can be seen in the MFE structure... aha, so it does not work?
look at ensemble of structures and dot-plot:
```sh
RNAfold -p --motif="GAUACCAG&CCCUUGGCAGC,(...((((&)...)))...),-9.22" < RS3mut.fa
```

aha, high percentage of structures exhibit the aptamer structure bound to the ligand.
But whats the percentage?

## Calculate probability of aptamer
use hard constraints to calculate the accessibility of RBS with and without sRNA

file `RS3_constraint.fa` contains the structure of the theophyllin aptamer, which can be used as hard constraint with `-C`

### without ligand
```sh
RNAfold -p -C <( cat RS3mut.fa RS3_constraint.fa )
```

prob(aptamer) = exp((pf - constraint_energy) / KT)
KT = ((temperature + 273.15)*1.98717)/1000.0

calculation should be:
e^((-26,04+17,05)÷(((37+273,15)×1,98717)÷1000)) = 0,000000463 = 0,00% of states exhibit have the aptamer structure without ligand


### with ligand
```sh
RNAfold -p -C --motif="GAUACCAG&CCCUUGGCAGC,(...((((&)...)))...),-9.22"
<( cat RS3mut.fa RS3_constraint.fa )
```

prob(aptamer) = exp((pf - constraint_energy) / KT)
KT = ((temperature + 273.15)*1.98717)/1000.0

calculation should be:
e^((-26,55+26,16)÷(((37+273,15)×1,98717)÷1000)) = 0,53110934 = 53,11% of states exhibit have the aptamer structure with ligand


## References 
``` Wachsmuth, Manja, Sven Findeiß, Nadine Weissheimer,
Peter F. Stadler, and Mario Mörl. 2013. “De Novo Design of a Synthetic
Riboswitch That Regulates Transcription Termination.” Nucleic Acids
Research 41 (4): 2541–51. doi:10.1093/nar/gks1330.  ```
