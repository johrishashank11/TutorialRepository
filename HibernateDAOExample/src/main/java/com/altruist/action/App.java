package com.altruist.action;


import java.util.List;

import com.altruist.entity.Book;
import com.altruist.service.BookServices;

public class App 
{
	
/********************************************************************
This class consists of the main method which uses the service class
methods to store, retrieve, update or delete the data from the 
database table. To perform the CRUD operations we will use the
service class methods.
********************************************************************/
	public static void main(String args[])
	{
		try
		{
			BookServices bookservices=new BookServices();
			String id="13";
			String title="xcvxvcvvcxxcv";
			String author="xcvcvcvcvxc";
			Book book1= new Book();
			book1.setId(id);
			book1.setTitle(title);
			book1.setAuthor(author);
			bookservices.persist(book1);
			System.out.println("Data Inserted Successfully");
			
			
	        List<Book> books1 = bookservices.findAll();
	        System.out.println("Books Persisted are :");
	        for (Book b : books1) 
	        {
	        	System.out.println(b.getId()+","+b.getTitle()+","+b.getAuthor());
	        }
	        bookservices.delete("4");
	        System.out.println("Data Deleted Successfully");
	        List<Book> books2 = bookservices.findAll();
	        System.out.println("Books Persisted are :");
	        for (Book b : books2) 
	        {
	        	System.out.println(b.getId()+","+b.getTitle()+","+b.getAuthor());
	        }
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
	}
}
