tail -n1 test.fa |awk 'BEGIN{FS=t}{n=split(,array,);for (i=1;i<=n;i++){srand(i);print i,array[i],rand()}}' > shape_react
