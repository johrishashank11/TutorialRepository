package com.altruist.Thread;

/*********************************************************************************
 MultiThreading means dividing chunk of data into multiple threads and executing
 these threads concurrently which will save a lot of time and execution will be
 fast.
 MultiThreading can be done using two methods i.e. implement Runnable interface
 and extending Thread class. I prefer Runnable interface over Thread class.
 When we implement Runnable interface then a method is also implemented i.e. 
 public void run() method. This is the method where we write our logic or major
 code which is being executed.
 To call this run() method we use another method i.e. start() method.
 ********************************************************************************/


public class ThreadTutorial1 implements Runnable
{
	@Override
	public void run() 
	{
		
/*********************************************************************************
 Thread.currentThread().getName() prints the name of the current thread.
 Thread.currentThread().getPriority() prints the priority of the current thread.
 Thread.currentThread().isAlive() prints whether the current thread is alive or
 not.
 ********************************************************************************/
		
		try
		{
			System.out.println("Thread Name = " + Thread.currentThread().getName());
			System.out.println("Thread Priority = " + Thread.currentThread().getPriority());
			System.out.println("Thread Alive Or Not = " + Thread.currentThread().isAlive());
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
	}
	
	public static void main(String args[])
	{
		ThreadTutorial1 tutorial=new ThreadTutorial1();
		Thread t1=new Thread(tutorial, "FirstThread");
		Thread t2=new Thread(tutorial, "SecondThread");
		Thread t3=new Thread(tutorial, "ThirdThread");
		Thread t4=new Thread(tutorial, "FourthThread");
		Thread t5=new Thread(tutorial, "FifthThread");
		
/*********************************************************************************
 As soon as the start() method is called for the particular thread then the 
 execution for the start() method will finish/return at the same point.It will not
 wait until the run() method is executed but for that thread run() method will be 
 executed as if executed by a different CPU.
 ********************************************************************************/
		
		t1.start();
		t2.start();
		t3.start();
		t4.start();
		t5.start();
	}
}