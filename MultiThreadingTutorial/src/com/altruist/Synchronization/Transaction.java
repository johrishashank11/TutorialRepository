package com.altruist.Synchronization;

class Transaction extends Thread 
{

/******************************************************************************
Enum is used to make user-defined data types which can be used in our block
of code.
******************************************************************************/
	
	public static enum TransactionType 
	{
		DEPOSIT_MONEY(1), WITHDRAW_MONEY(2);
 
		private TransactionType(int value) 
		{
		}
	};
	private TransactionType transactionType;
	private BankAccount account;
	private double amount;
 
	public Transaction(BankAccount account, TransactionType transactionType, double amount) 
	{
		this.transactionType = transactionType;
		this.account = account;
		this.amount = amount;
	}
 
	public void run() 
	{
		switch (this.transactionType) 
		{
		case DEPOSIT_MONEY:
			depositAmount();
			printBalance();
			break;
		case WITHDRAW_MONEY:
			withdrawAmount();
			printBalance();
			break;
		default:
			System.out.println("NOT A VALID TRANSACTION");
		}
	}
 
	public void depositAmount() 
	{
		this.account.depositAmount(this.amount);
	}
 
	public void withdrawAmount() 
	{
		this.account.withdrawAmount(amount);
	}
 
	public void printBalance() 
	{
		System.out.println(Thread.currentThread().getName() + " : TransactionType: " + this.transactionType + ", Amount: " + this.amount);
		System.out.println("New Account Balance: " + this.account.getAccountBalance());
	}
}

