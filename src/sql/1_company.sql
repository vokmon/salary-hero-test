-- public.company definition

-- Drop table

-- DROP TABLE public.company;

CREATE TABLE public.company (
	id varchar(40) NOT NULL, -- unique identifier
	"name" varchar(255) NOT NULL, -- company name
	address varchar(255) NOT NULL, -- company address
	phone varchar NULL, -- compnay phone number
	created_by varchar(100) NOT NULL, -- created by
	created_date timestamp NOT NULL, -- created date
	updated_by varchar(100) NULL, -- updated by
	updated_date timestamp NULL, -- updated date
	CONSTRAINT company_pk PRIMARY KEY (id),
	CONSTRAINT company_un UNIQUE (name)
);
COMMENT ON TABLE public.company IS 'Company data';

-- Column comments

COMMENT ON COLUMN public.company.id IS 'unique identifier';
COMMENT ON COLUMN public.company."name" IS 'company name';
COMMENT ON COLUMN public.company.address IS 'company address';
COMMENT ON COLUMN public.company.phone IS 'compnay phone number';
COMMENT ON COLUMN public.company.created_by IS 'created by';
COMMENT ON COLUMN public.company.created_date IS 'created date';
COMMENT ON COLUMN public.company.updated_by IS 'updated by';
COMMENT ON COLUMN public.company.updated_date IS 'updated date';