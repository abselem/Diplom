# Generated by Django 4.1.7 on 2023-04-20 18:19

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('bank_info', '0025_alter_paymentcompanycategories_logo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='paymentcompanytransfers',
            name='client',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]