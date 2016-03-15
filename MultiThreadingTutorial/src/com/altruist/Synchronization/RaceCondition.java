package com.altruist.Synchronization;

/*****************************************************************************
Race Condition arises during Multi-Threading when one or more thread tries to
write a block of code without finishing the execution of the previous thread.
In this situation race condition arises and to remove race condition we use 
"synchronized" keyword.
By using synchronized keyword we can make a block of code "Thread Safe" which
means that only on thread will be executed in that block of code and when
the execution of that thread will finish only then the next thread will 
execute on that block of code.
*****************************************************************************/

public class RaceCondition 
{
	public static void main(String[] args) 
	{
		BankAccount account = new BankAccount("AccountNumber");
 
		for (int i = 0; i < 5; i++) 
		{
			Transaction t = new Transaction(account, Transaction.TransactionType.DEPOSIT_MONEY, 100);
			t.start();
		}
 
		for (int i = 0; i < 5; i++) 
		{
			Transaction t = new Transaction(account, Transaction.TransactionType.WITHDRAW_MONEY, 50);
			t.start();
 
		}
 
		try 
		{
			Thread.sleep(1000);
		} 
		catch (InterruptedException e) 
		{
			System.out.println(e);
		}
 
		// Expected account balance is 5000
		System.out.println("Final Account Balance: " + account.getAccountBalance());
	
}
}

