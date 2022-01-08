--
-- CTE to convert table to list
--
-- Credits:
-- https://www.sqlmatters.com/Articles/Converting%20row%20values%20in%20a%20table%20to%20a%20single%20concatenated%20string.aspx

create table vs (v varchar);
insert into vs (values ('f1.parquet'), ('f2.parquet'), ('f3.parquet'));

with recursive vl as
  (
     select   rowid, [v] as l
     from     vs
     where    rowid=0
   union all
     select   vs.rowid, list_append(vl.l, vs.v)
     from     vl
     join     vs
     on       vs.rowid = vl.rowid + 1
   )
   SELECT   l
   FROM     vl
   WHERE    rowid = (SELECT MAX(rowid) FROM vs);
   
