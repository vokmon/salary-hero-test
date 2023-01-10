-- public.money_transfer definition

-- Drop table

-- DROP TABLE public.money_transfer;

CREATE TABLE public.money_transfer (
	company_id varchar(100) NOT NULL, -- Company id
	employee_username varchar(100) NOT NULL, -- Employee username
	transferred_amount numeric NOT NULL, -- Transfered money
	transfer_date timestamp NULL, -- Transfer date
	id varchar(100) NOT NULL, -- Unique identifier
	CONSTRAINT money_transfer_pk PRIMARY KEY (id)
);
COMMENT ON TABLE public.money_transfer IS 'Money transfer';

-- Column comments

COMMENT ON COLUMN public.money_transfer.company_id IS 'Company id';
COMMENT ON COLUMN public.money_transfer.employee_username IS 'Employee username';
COMMENT ON COLUMN public.money_transfer.transferred_amount IS 'Transfered money';
COMMENT ON COLUMN public.money_transfer.transfer_date IS 'Transfer date';
COMMENT ON COLUMN public.money_transfer.id IS 'Unique identifier';