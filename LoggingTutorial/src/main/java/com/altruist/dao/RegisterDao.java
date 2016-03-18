package com.altruist.dao;

import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.Transaction;
import com.altruist.action.Register;
import com.altruist.util.HibernateUtil;

public class RegisterDao 
{
	private static  Logger logger = Logger.getLogger(RegisterDao.class);
	public static int saveUser(Register reg)
	{
		int i = 0;
		try
		{
			Session session=HibernateUtil.getSessionFactory().openSession();
			Transaction trans=(Transaction) session.beginTransaction();
			i=(Integer)session.save(reg);
			trans.commit();
			session.close();
		}
		catch(Exception e)
		{
			logger.error("Error", e);
			e.printStackTrace();
		}
		return i;
	}
}
