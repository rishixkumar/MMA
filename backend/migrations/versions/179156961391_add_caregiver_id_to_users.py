"""Add caregiver_id to users

Revision ID: 179156961391
Revises: 1bb7b0d039c8
Create Date: 2025-06-25 13:03:44.123456

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '179156961391'
down_revision = '1bb7b0d039c8'
branch_labels = None
depends_on = None

def upgrade():
    # Use batch mode for SQLite compatibility
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('caregiver_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key('fk_users_caregiver_id', 'users', ['caregiver_id'], ['id'])

def downgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_constraint('fk_users_caregiver_id', type_='foreignkey')
        batch_op.drop_column('caregiver_id')
