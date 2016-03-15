package com.altruist.Thread;

/*****************************************************************************
Tutorial on how to use join() method in your program.
*****************************************************************************/

public class ThreadTutorial3 implements Runnable
{

	@Override
	public void run() 
	{
			System.out.println("Thread Name=" + Thread.currentThread().getName());
			System.out.println("Thread Priority=" + Thread.currentThread().getPriority());
			System.out.println("Thread Alive or Not=" + Thread.currentThread().isAlive());
	}
	
	public static void main(String args[])
	{
		try
		{
			ThreadTutorial3 tutorial3=new ThreadTutorial3();
			Thread t1=new Thread(tutorial3, "FirstThread");
			Thread t2=new Thread(tutorial3, "SecondThread");
			Thread t3=new Thread(tutorial3, "ThirdThread");
			Thread t4=new Thread(tutorial3, "FourthThread");
			Thread t5=new Thread(tutorial3, "FifthThread");
			t1.start();
			t2.start();
			t3.start();
			t4.start();
			t5.start();
			
/*****************************************************************************
join() method will completely finish the execution of the current thread and
after the execution of the current thread is finished only then it will go
to the next thread for its execution. 			
*****************************************************************************/			
			t1.join();
			t2.join();
			t3.join();
			t4.join();
			t5.join();
			System.out.println("Thread1 Status=" + t1.isAlive());
			System.out.println("Thread2 Status=" + t2.isAlive());
			System.out.println("Thread3 Status=" + t3.isAlive());
			System.out.println("Thread4 Status=" + t4.isAlive());
			System.out.println("Thread5 Status=" + t5.isAlive());
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
	}
}
