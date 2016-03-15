package com.altruist.Thread;

/*****************************************************************************
Tutorial on how to use Thread.sleep() in your program.
*****************************************************************************/

public class ThreadTutorial2 implements Runnable
{

	@Override
	public void run() 
	{
		try
		{
			System.out.println("Thread Name = " + Thread.currentThread().getName());
			
/*****************************************************************************
Thread.sleep(1000); will make your current thread in the run() method to go 
to sleep fort the specified time and as soon as the thread will come out of 
sleep then the scheduler will pick the thread and will finish its execution. 			
*****************************************************************************/
			
			Thread.sleep(1000);
			System.out.println("Thread Priority = " + Thread.currentThread().getPriority());
			System.out.println("Thread Alive or Not = " + Thread.currentThread().isAlive());
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
	}
	
	public static void main(String args[])
	{
			ThreadTutorial2 tutorial2=new ThreadTutorial2();
			Thread t1=new Thread(tutorial2, "FirstThread");
			Thread t2=new Thread(tutorial2, "SecondThread");
			Thread t3=new Thread(tutorial2, "ThirdThread");
			Thread t4=new Thread(tutorial2, "FourthThread");
			Thread t5=new Thread(tutorial2, "FifthThread");
			t1.start();
			t2.start();
			t3.start();
			t4.start();
			t5.start();
	}
}
