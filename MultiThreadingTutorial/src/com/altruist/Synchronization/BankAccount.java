package com.altruist.Synchronization;

class BankAccount 
{
	private String AccountNumber;
	private double AccountBalance;
 
	public String getAccountNumber() 
	{
		return AccountNumber;
	}
 
	public double getAccountBalance() 
	{
		return AccountBalance;
	}
 
	public BankAccount(String AccountNumber) 
	{
		this.AccountNumber = AccountNumber;
	}
 
/******************************************************************************
In the below two method i have written synchronized keyword because in both 
these methods some write/change of value execution is happening and i want that
only single thread should work on these block of codes.
If i don't write synchronized keyword in the two methods then when the code will
execute then more than one thread can execute the code at the same time and
due to which the final result can differ. 
That is why synchronized keyword is important on those block of codes where 
more than one thread can execute and change the end result.
******************************************************************************/
	public synchronized boolean depositAmount(double amount) 
	{
		if (amount < 0) 
		{
			return false;
		} 
		else 
		{
			AccountBalance = AccountBalance + amount;
			return true;
		}
	}
 
	// Make a note of this line -- synchronized keyword added
	public synchronized boolean withdrawAmount(double amount) 
	{
		if (amount > AccountBalance) 
		{
			return false;
		} 
		else 
		{
			AccountBalance = AccountBalance - amount;
			return true;
		}
	}
}
