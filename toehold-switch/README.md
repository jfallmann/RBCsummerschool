# RNA toehold switch example


## Introduction
The toehold switches are artificial designs which were built to regulate translation of a GFP target gene.
A small RNA serves as trigger molecule to activate GPF expression by binding to the 5'UTR region.
During the design approach, both sequenzes were optimized to adopt only one stable secundary structure when on their own.
As soon as the sRNA binds the 5'UTR, a stable complex forms and triggers a strucutal change in the mRNA region.
This opens up the hairpin sequestering the RBS and the start codon, thus allowing for ribosomes to bind and initiate translation.

## Sequenzes
The 5'UTR can be found in `pAG_TS1_KS001.fa`, the sRNA in `pAG_TS1_AT001` and both together form `pAG_TS1_001`.

```
GGGUGAAUGAAUUGUAGGCUUGUUAUAGUUAUG AACAGAGGAG ACAUAAC AUG AACAAGCCUAACCUGGCGGCAGCGCAAAAGAUGCGUAAA
................................. (   RBS  ) ....... xxx <- start codon ...... coding region ...
```

## Constraint folding
structural must change if 5' end is unpaired. Can be checked with hard constraints

```sh
cat pAG_TS1_KS001.fa pAG_TS1_KS001_bindingsite.fa | RNAfold -C
```

if `-C` option is removed, then switch will fold into sequestering stem again!


## Predict cofolding
cofold with sRNA

```sh
RNAcofold < pAG_TS1_001.fa
```

To see dot-plot use `-p` option!

## Predict binding site
RNAup to predict binding site with opening and binding energies
```sh
RNAup -b < pAG_TS1_001.fa
```

# Calculate RBS accessibility
use hard constraints to calculate the accessibility of RBS with and without sRNA


### Without sRNA binding
```sh
cat pAG_TS1_KS001.fa | RNAfold -p
cat pAG_TS1_KS001.fa pAG_TS1_KS001_constraint.fa | RNAfold -p -C
```
prob(aptamer) = exp((pf - constraint_energy) / KT)
KT = ((temperature + 273.15)*1.98717)/1000.0

e^((-27,13+19,33)÷(((37+273,15)×1,98717)÷1000)) = 0,000003189 = 00,00% of states are completely accessible in the full region in and between RBS and AUG.


### With sRNA binding
```sh
cat pAG_TS1_001.fa | RNAcofold -p
cat pAG_TS1_001.fa pAG_TS1_001_constraint.fa | RNAcofold -p -C
```

e^((-79,6+79,28)÷(((37+273,15)×1,98717)÷1000)) = 0.59499031774 = 59,50% of states are completely accessible in the full region in and between RBS and AUG.


## References
```
Green, Alexander A., Pamela A. Silver, James J. Collins, and Peng Yin. 2014. “Toehold Switches: De-Novo-Designed Regulators of Gene Expression.” Cell 159 (4): 925–39. doi:10.1016/j.cell.2014.10.002.
```
