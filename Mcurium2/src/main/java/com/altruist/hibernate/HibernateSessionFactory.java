package com.altruist.hibernate;

import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;

public class HibernateSessionFactory 
{
	private static SessionFactory sessionFactory;
	static
	{
		try
		{
			Configuration configuration= new Configuration();
			configuration.configure("hibernate.cfg.xml");
			StandardServiceRegistryBuilder builder= new StandardServiceRegistryBuilder().applySettings(configuration.getProperties());
			sessionFactory=configuration.buildSessionFactory(builder.build());
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
	}
	public static SessionFactory getSessionFactory() {
		return sessionFactory;
	}
}
