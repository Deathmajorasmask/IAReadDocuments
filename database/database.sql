SELECT id, name, doc_group_id, doc_type_id, contract_id, url, isvalid, isreviewed, isactive, owner_user_id, owner_org_id, owner_office_id, expired_at, created_at, modified_at
	FROM public.docs ORDER BY id DESC LIMIT 100;
	
	SELECT * FROM orgs WHERE toid = 512351235
	
	
INSERT INTO docs (name, doc_group_id, doc_type_id, contract_id, url, isvalid, isreviewed, isactive, owner_user_id, owner_org_id, owner_office_id, expired_at, created_at, modified_at)
VALUES ('Poliza Flotillas Banorte', 3, 25, 104534, 'AER/users/9998797483398_3_25_104534_20231228.pdf', true, false, true, 68588, 108, null, '2024-04-01 00:00:00+00', '2023-12-28 16:0:29.999+00','2023-12-28 16:0:29.999+00')

SELECT * FROM passi_set_docs('Poliza Flotillas Banorte', 3, 25, 104534, 'AER/users/9998797483398_3_25_104534_20231228.pdf', true, false, true, 68588, 108, null, '2024-04-01 00:00:00+00');

CREATE OR REPLACE FUNCTION passi_set_docs(in_name character varying, in_doc_group_id int, in_doc_type_id int, in_contract_id int, in_url character varying, in_isvalid boolean, in_isreviewed boolean, in_isactive boolean, in_owner_user_id int, in_owner_org_id int, in_owner_office_id int, in_expired_at character varying)
  returns TABLE (id int)
  language plpgsql as
  $func$
  declare
  begin 
	INSERT INTO docs (name, doc_group_id, doc_type_id, contract_id, url, isvalid, isreviewed, isactive, owner_user_id, owner_org_id, owner_office_id, expired_at, created_at, modified_at)
	VALUES (in_name, in_doc_group_id, in_doc_type_id, in_contract_id, in_url, in_isvalid, in_isreviewed, in_isactive, in_owner_user_id, in_owner_org_id, in_owner_office_id,  TO_TIMESTAMP(in_expired_at, 'YYYY-MM-DD-HH24:MI:ss'), current_timestamp, current_timestamp);
  return QUERY SELECT docs.id FROM docs ORDER BY id DESC LIMIT 1;
  end;
  $func$;