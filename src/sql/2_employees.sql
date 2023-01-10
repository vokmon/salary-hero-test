-- public.employees definition

-- Drop table

-- DROP TABLE public.employees;

CREATE TABLE public.employees (
	username varchar(100) NOT NULL, -- Employee username and unique identifier
	first_name varchar(255) NOT NULL, -- Employee first name
	last_name varchar(255) NOT NULL, -- Employee last name
	"password" varchar(255) NULL,
	salary numeric NULL,
	is_admin bool NULL DEFAULT false, -- Is Admin
	created_by varchar(100) NOT NULL, -- Created by
	created_date timestamp NOT NULL, -- Created date
	updated_by varchar(100) NULL, -- Updated by
	updated_date timestamp NULL,
	company_id varchar(100) NOT NULL, -- Company id
	CONSTRAINT employees_pk PRIMARY KEY (username, company_id)
);

-- Column comments

COMMENT ON COLUMN public.employees.username IS 'Employee username and unique identifier';
COMMENT ON COLUMN public.employees.first_name IS 'Employee first name';
COMMENT ON COLUMN public.employees.last_name IS 'Employee last name';
COMMENT ON COLUMN public.employees.is_admin IS 'Is Admin';
COMMENT ON COLUMN public.employees.created_by IS 'Created by';
COMMENT ON COLUMN public.employees.created_date IS 'Created date';
COMMENT ON COLUMN public.employees.updated_by IS 'Updated by';
COMMENT ON COLUMN public.employees.company_id IS 'Company id';


-- public.employees foreign keys

ALTER TABLE public.employees ADD CONSTRAINT employees_fk FOREIGN KEY (company_id) REFERENCES public.company(id);