package com.altruist.dao;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;

import com.altruist.entity.Book;

/*********************************************************************************
DAO stands for Data Access Object which implements the interface and defines the
structure of the method. In this class we define sessions, sessionfactory, 
transactions, persist, update, delete etc.
*********************************************************************************/

public class BookDao implements BookDaoInterface<Book,String>
{
	private Session session;
	private Transaction transaction;
	
/********************************************************************************
getSessionFactory() method returns the sessionfactory which is used to open the
session. It uses Configuration and StandardServiceRegistryBuilder classes to 
create the sessionfactory object.
It is a heavy weight object which is created once for one database. 
********************************************************************************/
	
	private static SessionFactory getSessionFactory()
	{
		SessionFactory sessionfactory = null;
		try
		{
			Configuration configure=new Configuration().configure();
			StandardServiceRegistryBuilder builder=new StandardServiceRegistryBuilder().applySettings(configure.getProperties());
			sessionfactory=configure.buildSessionFactory(builder.build());
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return sessionfactory;
	}
	
/*******************************************************************************
openCurrentSession() methods uses getSessionfactory() method to open a session.
*******************************************************************************/
	
	public Session openCurrentSession()
	{
		try
		{
			session=getSessionFactory().openSession();
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return session;
	}

/*******************************************************************************
openCurrentSessionwith Transaction() methods uses getSessionfactory() method to
open the seesion and begin the transaction also.
*******************************************************************************/	
	
	public Session openCurrentSessionwithTransation()
	{
		try
		{
			session=getSessionFactory().openSession();
			transaction=session.beginTransaction();
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return session;
	}
	
/*******************************************************************************
closeCurrentSession() method is used to close the current open session.
*******************************************************************************/	
	
	public void closeCurrentSession()
	{
		try
		{
			session.close();
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
	}
	
/*******************************************************************************
closeSessionwithTransaction() method is used to close the current open session
and commit the transaction also.
*******************************************************************************/	
	
	public void closeSessionwithTransaction()
	{
		try
		{
			transaction.commit();
			session.close();
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
	}

	public Session getSession() {
		return session;
	}

	public void setSession(Session session) {
		this.session = session;
	}

	public Transaction getTransaction() {
		return transaction;
	}

	public void setTransaction(Transaction transaction) {
		this.transaction = transaction;
	}
	
/*******************************************************************************
persist() method is used to store the data into the table.
*******************************************************************************/	
	
	public void persist(Book entity)
	{
		try
		{
			session.save(entity);
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
	}
	
/*******************************************************************************
update() method is used to update the data into the table.
*******************************************************************************/	
	
	public void update(Book entity)
	{
		try
		{
			session.update(entity);
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
	}
	
/*******************************************************************************
findById() method is used to find or retrieve the data using the is from the 
table.
*******************************************************************************/	
	
	public Book findById(String id)
	{
		Book book = null;
		try
		{
			book=(Book) session.get(Book.class, id);
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return book;
	}
	
/*******************************************************************************
delete() method is used to delete the data from the table.
*******************************************************************************/	
	
	public void delete(Book entity)
	{
		try
		{
			session.delete(entity);
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
	}
	
/*******************************************************************************
findAll() method is used to retrieve the data from the table in to a list.
*******************************************************************************/	
	
	@SuppressWarnings("unchecked")
	public List<Book> findAll()
	{
		List<Book> booklist = null;
		try
		{
			booklist=(List<Book>) session.createQuery("from Book").list();
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return booklist;
	}
	
/*******************************************************************************
deleteAll() method is used to delete the data from the table.
*******************************************************************************/	
	
	public void deleteAll()
	{
		List<Book> entityList=findAll();
		for(Book entity:entityList)
		{
			delete(entity);
		}
	}
}
