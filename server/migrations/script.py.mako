"""Add your migration message here

Revision ID: '12345'
Revises: 'previous_revision_id'
Create Date: '2024-07-14'

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '12345'
down_revision = 'previous_revision_id'
branch_labels = None
depends_on = None

def upgrade():
    # Add your upgrade operations here
    op.add_column('products', sa.Column('supplier', sa.String(length=255), nullable=True))
    op.add_column('products', sa.Column('sku', sa.String(length=255), nullable=True))
    op.add_column('products', sa.Column('quantity', sa.Integer(length=255), nullable=True))

def downgrade():
    # Add your downgrade operations here
    op.drop_column('products', 'suppliers_id')
    op.drop_column('products', 'date')
