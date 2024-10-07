--
-- DuckDB added a List() aggregate
--

create table vs (v varchar);
insert into vs (values ('f1.parquet'), ('f2.parquet'), ('f3.parquet'));
select list(v) from vs;
