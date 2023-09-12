# Generated by Django 4.1.7 on 2023-04-20 14:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('bank_info', '0017_paymentcompany_paymentcompanycategories_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='paymentcompany',
            name='kind',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='bank_info.paymentcompanycategories'),
            preserve_default=False,
        ),
    ]