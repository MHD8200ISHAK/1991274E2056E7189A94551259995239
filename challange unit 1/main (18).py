def factroial(n):
   if n==0 or n==1:
     return 1
   else:
      return n*factroial(n-1)
number=int(input("enter a number : "))
result=factroial(number)
print(f"the factroial of {number} is {result}")